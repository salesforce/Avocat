/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {Endpoint} from '../../../../core/contract/model/endpoint';
import {Inject, Service} from 'typedi';
import EndpointMethodJsonSerializer from './endpoint-method-json-serializer';

@Service('endpoint-json.serializer')
export default class EndpointJsonSerializer {
    constructor(@Inject('endpoint-method-json.serializer') private methodJsonSerializer: EndpointMethodJsonSerializer) {
    }

    public serialize(endpoint: Endpoint): object {
        return {
            path: endpoint.path,
            endpointMethods: endpoint.endpointMethods.map(method => this.methodJsonSerializer.serialize(method))
        };
    }
}