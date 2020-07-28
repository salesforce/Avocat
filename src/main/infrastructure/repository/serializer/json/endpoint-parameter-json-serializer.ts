/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {EndpointParameter} from '../../../../core/contract/model/endpoint-parameter';
import {Service} from 'typedi';

@Service('endpoint-parameter-json.serializer')
export default class EndpointParameterJsonSerializer {

    public serialize(endpointParameter: EndpointParameter): object {
        return {
            type: endpointParameter.type,
            name: endpointParameter.name,
            description: endpointParameter.description,
            required: endpointParameter.required,
            schema: endpointParameter.schema,
            examples: endpointParameter.examples,
        };
    }
}