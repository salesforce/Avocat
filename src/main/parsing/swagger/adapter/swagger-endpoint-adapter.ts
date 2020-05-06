import {Endpoint} from '../../../core/contract/model/endpoint';
import {OpenAPIV3} from 'openapi-types';
import {EndpointMethod} from '../../../core/contract/model/endpoint-method';
import {SwaggerEndpointMethodAdapter} from './swagger-endpoint-method-adapter';
import {HttpMethod} from '../../../core/contract/enums/http-method';

export class SwaggerEndpointAdapter implements Endpoint {

    constructor(public readonly path: string,
                private pathProperties: OpenAPIV3.PathItemObject) {
    }

    get endpointMethods(): EndpointMethod[] {
        return [
            {type: HttpMethod.GET, value: this.pathProperties.get},
            {type: HttpMethod.POST, value: this.pathProperties.post}
        ].filter(({value}) => !!value)
            .map(({type, value}) => new SwaggerEndpointMethodAdapter(type, value as OpenAPIV3.OperationObject));
    }
}