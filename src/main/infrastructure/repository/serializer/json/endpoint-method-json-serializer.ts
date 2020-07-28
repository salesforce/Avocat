/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {EndpointMethod} from '../../../../core/contract/model/endpoint-method';
import {Inject, Service} from 'typedi';
import EndpointParameterJsonSerializer from './endpoint-parameter-json-serializer';
import {HttpStatusCode} from '../../../../core/contract/enums/http-status-code';
import {EndpointResponse} from '../../../../core/contract/model/endpoint-response';
import EndpointResponseJsonSerializer from './endpoint-response-json-serializer';

@Service('endpoint-method-json.serializer')
export default class EndpointMethodJsonSerializer {

    constructor(@Inject('endpoint-parameter-json.serializer') private parameterJsonSerializer: EndpointParameterJsonSerializer,
                @Inject('endpoint-response-json.serializer') private responseJsonSerializer: EndpointResponseJsonSerializer) {
    }

    public serialize(endpointMethod: EndpointMethod): object {
        return {
            method: endpointMethod.method,
            parameters: endpointMethod.parameters?.map(parameter => this.parameterJsonSerializer.serialize(parameter)),
            responsesSchemas: this.getResponsesAsObject(endpointMethod.responsesSchemas)
        };
    }

    private getResponsesAsObject(responsesSchemas: Map<HttpStatusCode, EndpointResponse>): object {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapAsObj: any = {};
        responsesSchemas.forEach((value, key) => {
            mapAsObj[key.toString() as keyof typeof mapAsObj] = this.responseJsonSerializer.serialize(value);
            return mapAsObj;
        });
        return mapAsObj;
    }
}

