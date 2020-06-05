/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import SwaggerParser from '@apidevtools/swagger-parser';
import {OpenAPI, OpenAPIV3} from 'openapi-types';
import {Service} from 'typedi';
import {Contract} from '../../../core/contract/model/contract';
import {ContractParser} from '../contract-parser';
import {SwaggerContractAdapter} from './adapter/swagger-contract-adapter';

@Service('swagger-contract-parser.service')
export default class SwaggerContractParser implements ContractParser {

    public async parse(contractPath: string): Promise<Contract> {
        const swaggerContract: OpenAPI.Document = await this.readAndValidate(contractPath);
        return new SwaggerContractAdapter(swaggerContract as OpenAPIV3.Document);
    }

    private readAndValidate = async (contractPath: string): Promise<OpenAPI.Document> => {
        try {
            return await SwaggerParser.validate(contractPath);
        } catch (err) {
            throw new Error('The contract is invalid: ' + err.message);
        }
    };
}