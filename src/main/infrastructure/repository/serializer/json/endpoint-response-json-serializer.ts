import {EndpointResponse} from '../../../../core/contract/model/endpoint-response';
import {Service} from 'typedi';

@Service('endpoint-response-json.serializer')
export default class EndpointResponseJsonSerializer {

    public serialize(endpointResponse: EndpointResponse): object {
        return {
            schema: endpointResponse.schema,
            contentType: endpointResponse.contentType,
            description: endpointResponse.description,
            scenarioOverride: endpointResponse.scenarioOverride
        };
    }
}