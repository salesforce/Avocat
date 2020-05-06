import {OpenAPIV3} from 'openapi-types';
import {EndpointResponse} from '../../../core/contract/model/endpoint-response';
import {SwaggerEndpointResponseAdapter} from './swagger-endpoint-response-adapter';

describe('Swagger endpoint response adapter test', () => {
    const DESCRIPTION = 'Standard response';
    const APP_JSON = 'application/json';
    const SCHEMA = {
        type: 'object' as OpenAPIV3.NonArraySchemaObjectType,
        required: ['id', 'attributes'],
        properties: {
            attributes: {
                type: 'object' as OpenAPIV3.NonArraySchemaObjectType,
                properties: {
                    type: {
                        type: 'string' as OpenAPIV3.NonArraySchemaObjectType,
                        description: 'The entity api name'
                    },
                    url: {
                        type: 'string' as OpenAPIV3.NonArraySchemaObjectType,
                        example: '/services/data/v44.0/sobjects/Xxx/KprB0000003ygxsIAA'
                    },
                }
            },
            Id: {
                type: 'string' as OpenAPIV3.NonArraySchemaObjectType,
                example: '500bndf9908uygxsIAA'
            }
        }
    };

    let responseObjectMock: OpenAPIV3.ResponseObject;

    beforeEach(() => {
        responseObjectMock = {
            description: DESCRIPTION,
            content: {'application/json': {schema: SCHEMA}}
        };
    });

    describe('When adapter is called with an OpenAPIv3 Response object', () => {
        it('Should return a nonempty Response object', () => {
            const endpointResponse: EndpointResponse = new SwaggerEndpointResponseAdapter(responseObjectMock);

            expect(endpointResponse).toMatchObject({
                contentType: APP_JSON,
                description: DESCRIPTION,
                schema: SCHEMA
            });
        });
    });

    describe('When adapter is called with an OpenAPIv3 Response object and content is undefined', () => {
        it('Should return a nonempty Response object with empty schema', () => {
            responseObjectMock.content = undefined;

            const endpointResponse: EndpointResponse = new SwaggerEndpointResponseAdapter(responseObjectMock);

            expect(endpointResponse).toMatchObject({description: DESCRIPTION, schema: {}});
        });
    });

    describe('When adapter is called with an OpenAPIv3 Response object and schema is undefined', () => {
        it('Should return a nonempty Response object with empty schema', () => {
            if (!responseObjectMock.content) {
                throw new Error('responseObjectMock content is undefined');
            }
            responseObjectMock.content['application/json'].schema = undefined;

            const endpointResponse: EndpointResponse = new SwaggerEndpointResponseAdapter(responseObjectMock);

            expect(endpointResponse).toMatchObject({description: DESCRIPTION, schema: {}});
        });
    });
});