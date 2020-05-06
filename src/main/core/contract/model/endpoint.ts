import {EndpointMethod} from './endpoint-method';

export interface Endpoint {
    path: string;
    endpointMethods: EndpointMethod[];
}