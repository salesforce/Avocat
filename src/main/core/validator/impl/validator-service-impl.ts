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

@Service('validator.service')
export class ValidatorServiceImpl implements ValidatorService {

    constructor(@Inject(() => FileStoreContractRepository) private contractRepository: ContractRepository,
                @Inject(() => AjvContractValidator) private contractValidator: ContractValidator,
                @Inject(() => AxiosHttpClient) private httpClient: HttpClient) {
    }

    public async* validateContractHavingNameAndVersion(hostURL: string, contractName: string, contractVersion: string): AsyncGenerator<ValidationResult[]> {
        const loadedContract = await this.contractRepository.findByNameAndVersion(contractName, contractVersion);
        yield this.validateContract(hostURL, loadedContract);
    }

    public async* validateContractsHavingVersion(hostURL: string, contractVersion: string): AsyncGenerator<ValidationResult[]> {
        const contractsList = await this.contractRepository.findByVersion(contractVersion);
        for await (const loadedContract of this.loadContractsContents(contractsList)) {
            yield this.validateContract(hostURL, loadedContract);
        }
    }

    public async* validateContractHavingName(hostURL: string, contractName: string): AsyncGenerator<ValidationResult[]> {
        const contractsList = await this.contractRepository.findByName(contractName);
        for await (const loadedContract of this.loadContractsContents(contractsList)) {
            yield this.validateContract(hostURL, loadedContract);
        }
    }

    private async* loadContractsContents(contractsList: Contract[]): AsyncGenerator<Contract> {
        for (const contract of contractsList) {
            yield this.contractRepository.findByNameAndVersion(contract.name, contract.version);
        }
    }

    private validateContract(hostURL: string, contract: Contract): Promise<ValidationResult[]> {
        const metadataBuilder = new ValidationMetadataBuilder(hostURL, contract);
        return Promise.all(this.validateEndpoints(contract.endpoints, metadataBuilder));
    }

    private validateEndpoints = (endpointsList: Endpoint[], metadataBuilder: ValidationMetadataBuilder): Promise<ValidationResult>[] => {
        const validationResultNestedList: Promise<ValidationResult>[][] = endpointsList
            .map(endpoint => this.validateEndpoint(endpoint, metadataBuilder));

        return this.flattenValidationResultList(validationResultNestedList);
    };

    private validateEndpoint = (endpoint: Endpoint, metadataBuilder: ValidationMetadataBuilder): Promise<ValidationResult>[] => {
        metadataBuilder
            .withPath(endpoint.path);
        const validationResultNestedList: Promise<ValidationResult>[][] = endpoint.endpointMethods
            .map(endpointMethod => this.validateEndpointMethod(endpointMethod, metadataBuilder));

        return this.flattenValidationResultList(validationResultNestedList);
    };

    private flattenValidationResultList = (validationResultNestedList: Promise<ValidationResult>[][]): Promise<ValidationResult>[] =>
        Array.prototype.concat(...validationResultNestedList);

    private validateEndpointMethod(endpointMethod: EndpointMethod, metadataBuilder: ValidationMetadataBuilder): Promise<ValidationResult>[] {
        const responsesValidationResults: Promise<ValidationResult>[] = [];
        for (const [statusCode, endpointResponse] of Object.entries(endpointMethod.responsesSchemas)) {
            const metadata = metadataBuilder
                .withStatusCode(statusCode as HttpStatusCode)
                .withMethod(endpointMethod.method)
                .withParameters(endpointMethod.parameters || [])
                .build();
            const res = this.validateEndpointResponse(endpointResponse, metadata);
            responsesValidationResults.push(res);
        }
        return responsesValidationResults;
    }

    private validateEndpointResponse = (endpointResponse: EndpointResponse, metadata: ValidationMetadata): Promise<ValidationResult> =>
        this.callAPI(metadata)
            .then(httpResponse =>
                this.contractValidator.validate(new ValidationAttempt(metadata.statusCode, endpointResponse.schema, httpResponse))
            )
            .then(validationResult => ({
                ...validationResult,
                metadata: metadata
            }))
            .catch(apiError =>
                ({metadata, valid: false, errors: [apiError.message]})
            );

    private async callAPI(metadata: ValidationMetadata): Promise<HttpResponse> {
        if (metadata.method === HttpMethod.GET) {
            return this.httpClient.get(this.combineURLs(metadata.hostURL, metadata.path), metadata.parameters);
        } else {
            throw new NotImplementedError('Sorry!! http method POST is not implemented yet');
        }
    }

    private combineURLs = (hostUrl: string, endpointUrl: string): string =>
        hostUrl.replace(/\/+$/, '') + '/' + endpointUrl.replace(/^\/+/, '');
}