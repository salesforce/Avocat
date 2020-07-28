/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {EndpointResponse} from '../../../../core/contract/model/endpoint-response';
import {ContentType} from '../../../../core/contract/enums/content-type';
import EndpointResponseJsonSerializer from './endpoint-response-json-serializer';

describe('Endpoint Response JSON serializer test', () => {
    const RESPONSE: EndpointResponse = {
        schema: {},
        contentType: ContentType.JSON,
        description: 'description',
        scenarioOverride: 'scenarioOverride'
    };
    let sut: EndpointResponseJsonSerializer;

    beforeEach(() => {
        sut = new EndpointResponseJsonSerializer();
    });

    describe('When serialize is called with a nonempty response object', () => {
        it('Should return a JSON string containing response properties', () => {
            expect(sut.serialize(RESPONSE)).toMatchObject(RESPONSE);
        });
    });
});