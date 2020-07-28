/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {EndpointResponse} from '../../../../core/contract/model/endpoint-response';
import {Service} from 'typedi';

@Service('endpoint-response-json.serializer')
export default class EndpointResponseJsonSerializer {

    public serialize(endpointResponse: EndpointResponse): object {
        return {
            schema: endpointResponse.schema,
            contentType: endpointResponse.contentType,
            description: endpointResponse.description,
            scenarioOverride: endpointResponse.scenarioOverride
        };
    }
}