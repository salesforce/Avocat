/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

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