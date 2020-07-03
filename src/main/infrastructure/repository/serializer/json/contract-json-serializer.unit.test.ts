import {ContractSerializer} from '../contract-serializer';
import ContractJsonSerializer from './contract-json-serializer';
import EndpointJsonSerializer from './endpoint-json-serializer';
import {Contract} from '../../../../core/contract/model/contract';
import {ContractStatus} from '../../../../core/contract/enums/contract-status';
import {HttpMethod} from '../../../../core/contract/enums/http-method';
import {EndpointResponse} from '../../../../core/contract/model/endpoint-response';
import {HttpStatusCode} from '../../../../core/contract/enums/http-status-code';
import {Endpoint} from '../../../../core/contract/model/endpoint';

describe('Contract JSON serializer test', () => {
    const ENDPOINT: Endpoint = {
        path: 'path',
        endpointMethods: [{
            method: HttpMethod.GET,
            parameters: [],
            responsesSchemas: new Map<HttpStatusCode, EndpointResponse>()
        }]
    };
    const CONTRACT: Contract = {
        name: 'name',
        version: 'version',
        status: ContractStatus.NOT_VERIFIED,
        description: 'description',
        endpoints: [ENDPOINT]
    };
    let sut: ContractSerializer;
    let endpointJsonSerializerMock: EndpointJsonSerializer;

    beforeEach(() => {
        endpointJsonSerializerMock = jest.genMockFromModule('./endpoint-json-serializer');
        sut = new ContractJsonSerializer(endpointJsonSerializerMock);
    });

    describe('When serialize is called with a nonempty contract object', () => {
        it('Should return a JSON string containing contract properties', () => {
            endpointJsonSerializerMock.serialize = jest.fn(() => ENDPOINT);

            expect(sut.serialize(CONTRACT)).toStrictEqual(JSON.stringify(CONTRACT));
            expect(endpointJsonSerializerMock.serialize).toHaveBeenCalledTimes(1);
        });
    });
});