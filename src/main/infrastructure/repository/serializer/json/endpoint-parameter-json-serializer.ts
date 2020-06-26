import {EndpointParameter} from '../../../../core/contract/model/endpoint-parameter';
import {Service} from 'typedi';

@Service('endpoint-parameter-json.serializer')
export default class EndpointParameterJsonSerializer {

    public serialize(endpointParameter: EndpointParameter): object {
        return {
            type: endpointParameter.type,
            name: endpointParameter.name,
            description: endpointParameter.description,
            required: endpointParameter.required,
            schema: endpointParameter.schema,
            examples: endpointParameter.examples,
        };
    }
}