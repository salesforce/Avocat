/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import EndpointJsonSerializer from './endpoint-json-serializer';
import {HttpMethod} from '../../../../core/contract/enums/http-method';
import {EndpointResponse} from '../../../../core/contract/model/endpoint-response';
import {HttpStatusCode} from '../../../../core/contract/enums/http-status-code';
import {Endpoint} from '../../../../core/contract/model/endpoint';
import EndpointMethodJsonSerializer from './endpoint-method-json-serializer';

describe('Endpoint JSON serializer test', () => {
    const METHOD = {
        method: HttpMethod.GET,
        parameters: [],
        responsesSchemas: new Map<HttpStatusCode, EndpointResponse>()
    };
    const ENDPOINT: Endpoint = {
        path: 'path',
        endpointMethods: [METHOD]
    };
    let sut: EndpointJsonSerializer;
    let methodJsonSerializerMock: EndpointMethodJsonSerializer;

    beforeEach(() => {
        methodJsonSerializerMock = jest.genMockFromModule('./endpoint-method-json-serializer');
        sut = new EndpointJsonSerializer(methodJsonSerializerMock);
    });

    describe('When serialize is called with a nonempty endpoint object', () => {
        it('Should return a JSON string containing endpoint properties', () => {
            methodJsonSerializerMock.serialize = jest.fn(() => METHOD);

            expect(sut.serialize(ENDPOINT)).toMatchObject(ENDPOINT);
            expect(methodJsonSerializerMock.serialize).toHaveBeenCalledTimes(1);
        });
    });
});