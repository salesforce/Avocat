import {HttpMethod} from '../../../../core/contract/enums/http-method';
import {EndpointResponse} from '../../../../core/contract/model/endpoint-response';
import {HttpStatusCode} from '../../../../core/contract/enums/http-status-code';
import EndpointMethodJsonSerializer from './endpoint-method-json-serializer';
import EndpointParameterJsonSerializer from './endpoint-parameter-json-serializer';
import EndpointResponseJsonSerializer from './endpoint-response-json-serializer';
import {EndpointParameter} from '../../../../core/contract/model/endpoint-parameter';
import {ParameterType} from '../../../../core/contract/enums/parameter-type';
import {EndpointMethod} from '../../../../core/contract/model/endpoint-method';

describe('Endpoint Method JSON serializer test', () => {
    const RESPONSE: EndpointResponse = {
        schema: {}
    };
    const PARAMETER: EndpointParameter = {
        type: ParameterType.QUERY,
        name: 'name',
        schema: {},
        examples: [],
        required: false
    };
    const METHOD: EndpointMethod = {
        method: HttpMethod.GET,
        parameters: [PARAMETER],
        responsesSchemas: new Map([['200' as HttpStatusCode, RESPONSE]])
    };
    let sut: EndpointMethodJsonSerializer;
    let parameterJsonSerializerMock: EndpointParameterJsonSerializer;
    let responseJsonSerializerMock: EndpointResponseJsonSerializer;

    beforeEach(() => {
        parameterJsonSerializerMock = jest.genMockFromModule('./endpoint-parameter-json-serializer');
        responseJsonSerializerMock = jest.genMockFromModule('./endpoint-response-json-serializer');
        sut = new EndpointMethodJsonSerializer(parameterJsonSerializerMock, responseJsonSerializerMock);
    });

    describe('When serialize is called with a nonempty method object', () => {
        it('Should return a JSON string containing method properties', () => {
            parameterJsonSerializerMock.serialize = jest.fn(() => PARAMETER);
            responseJsonSerializerMock.serialize = jest.fn(() => RESPONSE);

            expect(sut.serialize(METHOD)).toMatchObject(METHOD);
            expect(parameterJsonSerializerMock.serialize).toHaveBeenCalledTimes(1);
            expect(responseJsonSerializerMock.serialize).toHaveBeenCalledTimes(1);
        });
    });
});