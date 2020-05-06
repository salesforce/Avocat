import {Endpoint} from '../../../core/contract/model/endpoint';
import {SwaggerEndpointAdapter} from './swagger-endpoint-adapter';
import {OpenAPIV3} from 'openapi-types';
import {HttpMethod} from '../../../core/contract/enums/http-method';

describe('Swagger endpoint adapter test', () => {
    const CONTRACT_PATH = 'test/sample/contract';
    let PATH_PROPERTIES: OpenAPIV3.PathItemObject;

    beforeEach(() => {
        PATH_PROPERTIES = {
            get: {description: 'get'},
            post: {description: 'post'}
        };
    });

    describe('When adapter is called on an OpenAPIv3 Path object', () => {
        it('Should return a nonempty Endpoint object with 2 methods', () => {
            const endpoint: Endpoint = new SwaggerEndpointAdapter(CONTRACT_PATH, PATH_PROPERTIES);
            expect(endpoint).not.toBeUndefined();
            expect(endpoint.path).toStrictEqual(CONTRACT_PATH);
            expect(endpoint.endpointMethods).toHaveLength(2);
        });
    });

    describe('When adapter is called on an OpenAPIv3 Path object that has not get method', () => {
        it('Should return a nonempty Endpoint object with post method', () => {
            PATH_PROPERTIES.get = undefined;
            const endpoint: Endpoint = new SwaggerEndpointAdapter(CONTRACT_PATH, PATH_PROPERTIES);
            expect(endpoint).not.toBeUndefined();
            expect(endpoint.path).toStrictEqual(CONTRACT_PATH);
            expect(endpoint.endpointMethods).toHaveLength(1);
            expect(endpoint.endpointMethods[0].method).toStrictEqual(HttpMethod.POST);
        });
    });

    describe('When adapter is called on an OpenAPIv3 Path object that has not post method', () => {
        it('Should return a nonempty Endpoint object with get method', () => {
            PATH_PROPERTIES.post = undefined;
            const endpoint: Endpoint = new SwaggerEndpointAdapter(CONTRACT_PATH, PATH_PROPERTIES);
            expect(endpoint).not.toBeUndefined();
            expect(endpoint.path).toStrictEqual(CONTRACT_PATH);
            expect(endpoint.endpointMethods).toHaveLength(1);
            expect(endpoint.endpointMethods[0].method).toStrictEqual(HttpMethod.GET);
        });
    });
});