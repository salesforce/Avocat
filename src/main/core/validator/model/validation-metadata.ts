import {Contract} from '../../contract/model/contract';
import {HttpMethod} from '../../contract/enums/http-method';
import {HttpStatusCode} from '../../contract/enums/http-status-code';
import {EndpointParameter} from '../../contract/model/endpoint-parameter';

export interface ValidationMetadata {
    contract: Contract;
    hostURL: string;
    path: string;
    method: HttpMethod;
    parameters: EndpointParameter[];
    statusCode: HttpStatusCode;
}

export class ValidationMetadataBuilder {
    private readonly contract: Contract;
    private readonly hostURL: string;
    private path = '';
    private method = HttpMethod.GET;
    private parameters: EndpointParameter[] = [];
    private statusCode = HttpStatusCode.SUCCESS;

    constructor(hostURL: string, contract: Contract) {
        this.contract = contract;
        this.hostURL = hostURL;
    }

    public withPath(path: string): ValidationMetadataBuilder {
        this.path = path;
        return this;
    }

    public withStatusCode(statusCode: HttpStatusCode): ValidationMetadataBuilder {
        this.statusCode = statusCode;
        return this;
    }

    public withMethod(method: HttpMethod): ValidationMetadataBuilder {
        this.method = method;
        return this;
    }

    public withParameters(parameters: EndpointParameter[]): ValidationMetadataBuilder {
        this.parameters = parameters;
        return this;
    }

    public build(): ValidationMetadata {
        return {
            contract: Object.assign({}, this.contract),
            hostURL: this.hostURL,
            path: this.path,
            statusCode: this.statusCode,
            method: this.method,
            parameters: [...this.parameters]
        };
    }
}