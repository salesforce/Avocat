/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {ValidationResult} from '../model/validation-result';
import {Inject, Service} from 'typedi';
import {FileStoreContractRepository} from '../../../infrastructure/repository/file-store-contract-repository';
import {ContractRepository} from '../../contract/contract-repository';
import {Contract} from '../../contract/model/contract';
import {Endpoint} from '../../contract/model/endpoint';
import {EndpointMethod} from '../../contract/model/endpoint-method';
import {HttpResponse} from '../../http/model/http-response';
import {HttpMethod} from '../../contract/enums/http-method';
import {HttpStatusCode} from '../../contract/enums/http-status-code';
import {HttpClient} from '../../http/http-client';
import {AxiosHttpClient} from '../../../infrastructure/http/axios/axios-http-client';
import {ContractValidator} from '../contract-validator';
import {AjvContractValidator} from '../../../infrastructure/validator/ajv/ajv-contract-validator';
import {ValidationMetadata, ValidationMetadataBuilder} from '../model/validation-metadata';
import {EndpointResponse} from '../../contract/model/endpoint-response';
import {NotImplementedError} from '../../error/not-implemented-error';
import {ValidatorService} from '../validator-service';
import {ValidationAttempt} from '../model/validation-attempt';
import {EventEmitter} from 'events';

@Service('validator.service')
export class ValidatorServiceImpl implements ValidatorService {

    constructor(@Inject(() => FileStoreContractRepository) private contractRepository: ContractRepository,
                @Inject(() => AjvContractValidator) private contractValidator: ContractValidator,
                @Inject(() => AxiosHttpClient) private httpClient: HttpClient,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public async* validateContractHavingNameAndVersion(contractName: string, contractVersion: string): AsyncGenerator<ValidationResult[]> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('debug', `Looking for contract having name '${contractName}' and version '${contractVersion}'...`);

        const loadedContract = await this.contractRepository.findByNameAndVersion(contractName, contractVersion);
        this.loggingEE.emit('info', `Contract '${loadedContract.name}' loaded!`);

        yield this.validateContract(loadedContract);
    }

    public async* validateContractsHavingVersion(contractVersion: string): AsyncGenerator<ValidationResult[]> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('debug', `Looking for contracts having version '${contractVersion}'...`);

        const contractsList = await this.contractRepository.findByVersion(contractVersion);
        contractsList.forEach(contract =>
            this.loggingEE.emit('debug', `Contract '${contract.name}' version ${contract.version} found!`));

        for await (const loadedContract of this.loadContractsContents(contractsList)) {
            this.loggingEE.emit('info', `Contract '${loadedContract.name}' version ${loadedContract.version} loaded!`);
            yield this.validateContract(loadedContract);
        }
    }

    public async* validateContractHavingName(contractName: string): AsyncGenerator<ValidationResult[]> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('debug', `Looking for contracts having name '${contractName}'...`);

        const contractsList = await this.contractRepository.findByName(contractName);
        contractsList.forEach(contract =>
            this.loggingEE.emit('debug', `Contract '${contract.name}' version ${contract.version} found!`));

        for await (const loadedContract of this.loadContractsContents(contractsList)) {
            this.loggingEE.emit('info', `Contract '${loadedContract.name}' version ${loadedContract.version} loaded!`);
            yield this.validateContract(loadedContract);
        }
    }

    private async* loadContractsContents(contractsList: Contract[]): AsyncGenerator<Contract> {
        for (const contract of contractsList) {
            this.loggingEE.emit('debug', `Loading contract '${contract.name}' version ${contract.version}...`);
            yield this.contractRepository.findByNameAndVersion(contract.name, contract.version);
        }
    }

    private validateContract(contract: Contract): Promise<ValidationResult[]> {
        this.loggingEE.emit('info', `Running validation for the contract '${contract.name}' v'${contract.version}'`);

        const metadataBuilder = new ValidationMetadataBuilder(contract);
        return Promise.all(this.validateEndpoints(contract.endpoints, metadataBuilder));
    }

    private validateEndpoints = (endpointsList: Endpoint[], metadataBuilder: ValidationMetadataBuilder): Promise<ValidationResult>[] => {
        const validationResultNestedList: Promise<ValidationResult>[][] = endpointsList
            .map(endpoint => this.validateEndpoint(endpoint, metadataBuilder));

        return this.flattenValidationResultList(validationResultNestedList);
    };

    private validateEndpoint = (endpoint: Endpoint, metadataBuilder: ValidationMetadataBuilder): Promise<ValidationResult>[] => {
        this.loggingEE.emit('debug', `Running validation for the endpoint '${endpoint.path}'`);

        metadataBuilder
            .withPath(endpoint.path);
        const validationResultNestedList: Promise<ValidationResult>[][] = endpoint.endpointMethods
            .map(endpointMethod => this.validateEndpointMethod(endpointMethod, metadataBuilder));

        return this.flattenValidationResultList(validationResultNestedList);
    };

    private flattenValidationResultList = (validationResultNestedList: Promise<ValidationResult>[][]): Promise<ValidationResult>[] =>
        Array.prototype.concat(...validationResultNestedList);

    private validateEndpointMethod(endpointMethod: EndpointMethod, metadataBuilder: ValidationMetadataBuilder): Promise<ValidationResult>[] {
        this.loggingEE.emit('debug', `Running validation for the endpointMethod '${endpointMethod.method}'`);

        const responsesValidationResults: Promise<ValidationResult>[] = [];
        for (const [statusCode, endpointResponse] of Object.entries(endpointMethod.responsesSchemas)) {
            metadataBuilder
                .withStatusCode(statusCode as HttpStatusCode)
                .withMethod(endpointMethod.method)
                .withParameters(endpointMethod.parameters || []);
            if(endpointResponse.scenarioOverride) {
                metadataBuilder.withScenarioOverride(endpointResponse.scenarioOverride);
            }
            const metadata = metadataBuilder.build();
            const res = this.validateEndpointResponse(endpointResponse, metadata);
            responsesValidationResults.push(res);
        }
        return responsesValidationResults;
    }

    private validateEndpointResponse = (endpointResponse: EndpointResponse, metadata: ValidationMetadata): Promise<ValidationResult> => {
        this.loggingEE.emit('debug', `Running validation for the endpointResponse '${metadata.statusCode}'`);

        return this.callAPI(metadata)
            .then(httpResponse =>
                this.contractValidator.validate(new ValidationAttempt(metadata.statusCode, endpointResponse.schema, httpResponse))
            )
            .then(validationResult => this.handleValidationResult(validationResult, metadata))
            .catch(apiError => this.handleAPIError(apiError, metadata));
    }

    private async callAPI(metadata: ValidationMetadata): Promise<HttpResponse> {
        if (metadata.method === HttpMethod.GET) {
            return this.httpClient.get(metadata.path, metadata.parameters);
        } else {
            throw new NotImplementedError('Sorry!! http method POST is not implemented yet');
        }
    }

    private handleValidationResult = (validationResult: ValidationResult, metadata: ValidationMetadata): ValidationResult => {
        this.loggingEE.emit('info', `EndpointResponse '${metadata.statusCode}' ${validationResult.valid ? 'validated' : 'is not valid' }!`);
        return {
            ...validationResult,
            metadata: metadata
        };
    };

    private handleAPIError = (apiError: Error, metadata: ValidationMetadata): ValidationResult => {
        this.loggingEE.emit('error', `EndpointResponse '${metadata.statusCode}' validation result: Error calling API: '${apiError.message}'`);
        return {metadata, valid: false, errors: [apiError.message]};
    };
}