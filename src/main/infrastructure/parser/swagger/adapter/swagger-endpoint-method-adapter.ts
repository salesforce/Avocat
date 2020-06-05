import {EndpointMethod} from '../../../../core/contract/model/endpoint-method';
import {HttpMethod} from '../../../../core/contract/enums/http-method';
import {OpenAPIV3} from 'openapi-types';
import {HttpStatusCode} from '../../../../core/contract/enums/http-status-code';
import {EndpointResponse} from '../../../../core/contract/model/endpoint-response';
import {EndpointParameter} from '../../../../core/contract/model/endpoint-parameter';
import {SwaggerEndpointParameterAdapter} from './swagger-endpoint-parameter-adapter';
import {SwaggerEndpointResponseAdapter} from './swagger-endpoint-response-adapter';

export class SwaggerEndpointMethodAdapter implements EndpointMethod {
    constructor(public readonly method: HttpMethod,
                private methodProperties: OpenAPIV3.OperationObject) {
    }

    get parameters(): EndpointParameter[] {
        return this.methodProperties.parameters?.map(
            (parameter) => new SwaggerEndpointParameterAdapter(parameter as OpenAPIV3.ParameterObject)
        ) || [];
    }

    get responsesSchemas(): Map<HttpStatusCode, EndpointResponse> {
        return this.methodProperties.responses
            ? this.getResponsesAsMap(this.methodProperties.responses)
            : new Map<HttpStatusCode, EndpointResponse>();
    }

    private getResponsesAsMap(swaggerResponses: OpenAPIV3.ResponsesObject): Map<HttpStatusCode, EndpointResponse> {
        return Object.entries(swaggerResponses)
            .map(([responseStatusCode, swaggerResponseSchema]) => ({
                key: responseStatusCode,
                value: new SwaggerEndpointResponseAdapter(swaggerResponseSchema as OpenAPIV3.ResponseObject)
            }))
            .reduce((map: Map<HttpStatusCode, EndpointResponse>, {key, value}) => map.set(key as HttpStatusCode, value), new Map());
    }
}