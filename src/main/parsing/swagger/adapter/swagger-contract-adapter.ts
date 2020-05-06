import {OpenAPIV3} from 'openapi-types';
import {Contract} from '../../../core/contract/model/contract';
import {ContractStatus} from '../../../core/contract/enums/contract-status';
import {Endpoint} from '../../../core/contract/model/endpoint';
import {SwaggerEndpointAdapter} from './swagger-endpoint-adapter';

export class SwaggerContractAdapter implements Contract {

    constructor(private swaggerContract: OpenAPIV3.Document) {
    }

    public get name(): string {
        return this.swaggerContract.info.title;
    }

    public get version(): string {
        return this.swaggerContract.info.version;
    }

    public get status(): ContractStatus {
        return ContractStatus.NOT_VERIFIED;
    }

    public get description(): string {
        return this.swaggerContract.info.description || '';
    }

    public get components(): object {
        return this.swaggerContract.components || {};
    }

    public get endpoints(): Endpoint[] {
        return Object.entries(this.swaggerContract.paths).map(([path, pathProperties]) =>
            new SwaggerEndpointAdapter(path, pathProperties)
        );
    }
}