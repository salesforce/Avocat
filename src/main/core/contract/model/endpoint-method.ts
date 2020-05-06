import {HttpMethod} from '../enums/http-method';
import {EndpointParameter} from './endpoint-parameter';
import {HttpStatusCode} from '../enums/http-status-code';
import {EndpointResponse} from './endpoint-response';

export interface EndpointMethod {
    method: HttpMethod;
    parameters?: EndpointParameter[];
    responsesSchemas: Map<HttpStatusCode, EndpointResponse>;
}