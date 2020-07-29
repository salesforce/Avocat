/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {EndpointMethod} from '../../../../core/contract/model/endpoint-method';
import {HttpMethod} from '../../../../core/contract/enums/http-method';
import {SwaggerEndpointMethodAdapter} from './swagger-endpoint-method-adapter';
import {OpenAPIV3} from 'openapi-types';
import {ParameterType} from '../../../../core/contract/enums/parameter-type';
import {HttpStatusCode} from '../../../../core/contract/enums/http-status-code';

describe('Swagger endpoint method adapter test', () => {
    let RESPONSE: OpenAPIV3.ResponseObject;
    let PARAMETER: OpenAPIV3.ParameterObject;
    let METHOD: OpenAPIV3.OperationObject;

    beforeEach(() => {
        RESPONSE = {
            description: 'description',
            content: {
                'application/json': {
                    schema: {type: 'string'}
                } as OpenAPIV3.MediaTypeObject
            }
        };
        PARAMETER = {
            in: ParameterType.QUERY,
            name: 'name',
            schema: undefined,
            examples: {
                oneItem: {value: 'example'}
            },
            required: false
        };
        METHOD = {
            parameters: [PARAMETER],
            responses: {
                '200': RESPONSE
            }
        };
    });

    describe('When adapter is called on an OpenAPIv3 GET Method object', () => {
        it('Should return a nonempty Endpoint Method object', () => {
            const endpointMethod: EndpointMethod = new SwaggerEndpointMethodAdapter(HttpMethod.GET, METHOD);
            expect(endpointMethod).not.toBeUndefined();
            expect(endpointMethod.method).toStrictEqual(HttpMethod.GET);
            expect(endpointMethod.parameters).toHaveLength(1);
            expect(endpointMethod.responsesSchemas.get('200' as HttpStatusCode)).not.toBeUndefined();
        });
    });

    describe('When adapter is called on an OpenAPIv3 POST Method object', () => {
        it('Should return a nonempty Endpoint Method object', () => {
            const endpointMethod: EndpointMethod = new SwaggerEndpointMethodAdapter(HttpMethod.POST, METHOD);
            expect(endpointMethod).not.toBeUndefined();
            expect(endpointMethod.method).toStrictEqual(HttpMethod.POST);
            expect(endpointMethod.parameters).toHaveLength(1);
            expect(endpointMethod.responsesSchemas.get('200' as HttpStatusCode)).not.toBeUndefined();
        });
    });

    describe('When adapter is called on an OpenAPIv3 POST Method object that has no parameters', () => {
        it('Should return a nonempty Endpoint Method object with empty parameters list', () => {
            METHOD.parameters = undefined;
            const endpointMethod: EndpointMethod = new SwaggerEndpointMethodAdapter(HttpMethod.POST, METHOD);
            expect(endpointMethod).not.toBeUndefined();
            expect(endpointMethod.method).toStrictEqual(HttpMethod.POST);
            expect(endpointMethod.parameters).toHaveLength(0);
            expect(endpointMethod.responsesSchemas.get('200' as HttpStatusCode)).not.toBeUndefined();
        });
    });

    describe('When adapter is called on an OpenAPIv3 POST Method object that has no responses', () => {
        it('Should return a nonempty Endpoint Method object with empty responses map', () => {
            METHOD.responses = undefined;
            const endpointMethod: EndpointMethod = new SwaggerEndpointMethodAdapter(HttpMethod.POST, METHOD);
            expect(endpointMethod).not.toBeUndefined();
            expect(endpointMethod.method).toStrictEqual(HttpMethod.POST);
            expect(endpointMethod.parameters).toHaveLength(1);
            expect(endpointMethod.responsesSchemas.size).toStrictEqual(0);
        });
    });
});