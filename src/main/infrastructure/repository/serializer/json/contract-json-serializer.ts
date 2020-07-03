import {ContractSerializer} from '../contract-serializer';
import {Contract} from '../../../../core/contract/model/contract';
import EndpointJsonSerializer from './endpoint-json-serializer';
import {Inject, Service} from 'typedi';

@Service('contract-json.serializer')
export default class ContractJsonSerializer implements ContractSerializer {

    constructor(@Inject('endpoint-json.serializer') private endpointJsonSerializer: EndpointJsonSerializer) {
    }

    public serialize(contract: Contract): string {
        return JSON.stringify( {
            name: contract.name,
            version: contract.version,
            status: contract.status,
            description: contract.description,
            endpoints: contract.endpoints.map(endpoint => this.endpointJsonSerializer.serialize(endpoint))
        });
    }
}