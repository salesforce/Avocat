import {Endpoint} from '../../../core/contract/model/endpoint';
import {Inject, Service} from 'typedi';
import EndpointMethodJsonSerializer from './endpoint-method-json-serializer';

@Service('endpoint-json.serializer')
export default class EndpointJsonSerializer {
    constructor(@Inject('endpoint-method-json.serializer') private methodJsonSerializer: EndpointMethodJsonSerializer) {
    }

    public serialize(endpoint: Endpoint): object {
        return {
            path: endpoint.path,
            endpointMethods: endpoint.endpointMethods.map(method => this.methodJsonSerializer.serialize(method))
        };
    }
}