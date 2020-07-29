/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {OpenAPIV3} from 'openapi-types';
import {EndpointParameter} from '../../../../core/contract/model/endpoint-parameter';
import {SwaggerEndpointParameterAdapter} from './swagger-endpoint-parameter-adapter';
import {ParameterType} from '../../../../core/contract/enums/parameter-type';

describe('Swagger endpoint parameter adapter test', () => {
    const IN_QUERY = 'query';
    const IN_PATH = 'path';
    const NAME = 'sobject';
    const DESCRIPTION = 'The comma separated list of objects that the MRU are scoped to, such as Account or offer__c. All MRUs of all types are fetched by default';
    const IS_REQUIRED = true;
    const SCHEMA_STRING = {
        type: 'string' as OpenAPIV3.NonArraySchemaObjectType,
        pattern: '^.+(,.+)*$'
    };
    const SCHEMA_INTEGER = {
        type: 'integer' as OpenAPIV3.NonArraySchemaObjectType,
        minimum: 1,
        maximum: 200,
        default: 200
    };
    const EXAMPLES = ['Case', 'Account', 'Account,Work'];

    let parameterQueryObjectMock: OpenAPIV3.ParameterObject;
    let parameterPathObjectMock: OpenAPIV3.ParameterObject;

    beforeEach(() => {
        const baseParam = {
            name: NAME,
            description: DESCRIPTION,
            required: IS_REQUIRED,
            example: EXAMPLES[0],
            examples: {
                oneItem: {value: EXAMPLES[1]},
                multipleItems: {value: EXAMPLES[2]}
            }
        };
        parameterQueryObjectMock = {
            in: IN_QUERY,
            schema: SCHEMA_STRING,
            ...baseParam
        };
        parameterPathObjectMock = {
            in: IN_PATH,
            schema: SCHEMA_INTEGER,
            ...baseParam
        };
    });

    describe('When adapter is called with an OpenAPIv3 Query Parameter object', () => {
        it('Should return a nonempty Query Parameter object', () => {
            const endpointParameter = new SwaggerEndpointParameterAdapter(parameterQueryObjectMock);

            expect(endpointParameter).toMatchObject({
                type: ParameterType.QUERY,
                schema: SCHEMA_STRING,
                name: NAME,
                description: DESCRIPTION,
                required: IS_REQUIRED,
            });
            expect(endpointParameter.examples.sort()).toStrictEqual(EXAMPLES.sort());
        });
    });

    describe('When adapter is called with an OpenAPIv3 Path Parameter object', () => {
        it('Should return a nonempty Path parameter object', () => {
            const endpointParameter: EndpointParameter = new SwaggerEndpointParameterAdapter(parameterPathObjectMock);

            expect(endpointParameter).toMatchObject({
                type: ParameterType.PATH,
                schema: SCHEMA_INTEGER,
                name: NAME,
                description: DESCRIPTION,
                required: IS_REQUIRED,
            });
            expect(endpointParameter.examples.sort()).toStrictEqual(EXAMPLES.sort());
        });
    });

    describe('When adapter is called with an OpenAPIv3 Path Parameter object that has not all required properties', () => {
        it('Should return a nonempty Path parameter object with empty not required properties', () => {
            parameterPathObjectMock.examples = undefined;
            parameterPathObjectMock.example = undefined;
            parameterPathObjectMock.required = undefined;
            parameterPathObjectMock.description = undefined;

            const endpointParameter: EndpointParameter = new SwaggerEndpointParameterAdapter(parameterPathObjectMock);

            expect(endpointParameter).toMatchObject({
                required: false,
                description: '',
                examples: []
            });
        });
    });
});