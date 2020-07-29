/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {HttpMethod} from '../enums/http-method';
import {EndpointParameter} from './endpoint-parameter';
import {HttpStatusCode} from '../enums/http-status-code';
import {EndpointResponse} from './endpoint-response';

export interface EndpointMethod {
    method: HttpMethod;
    parameters?: EndpointParameter[];
    responsesSchemas: Map<HttpStatusCode, EndpointResponse>;
}