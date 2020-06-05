import EndpointParameterJsonSerializer from './endpoint-parameter-json-serializer';
import {EndpointParameter} from '../../../../core/contract/model/endpoint-parameter';
import {ParameterType} from '../../../../core/contract/enums/parameter-type';

describe('Endpoint Parameter JSON serializer test', () => {
    const PARAMETER: EndpointParameter = {
        type: ParameterType.QUERY,
        name: 'name',
        schema: {},
        examples: [],
        required: false
    };
    let sut: EndpointParameterJsonSerializer;

    beforeEach(() => {
        sut = new EndpointParameterJsonSerializer();
    });

    describe('When serialize is called with a nonempty parameter object', () => {
        it('Should return a JSON string containing parameter properties', () => {
            expect(sut.serialize(PARAMETER)).toMatchObject(PARAMETER);
        });
    });
});