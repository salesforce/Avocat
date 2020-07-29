/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {EndpointParameter} from '../contract/model/endpoint-parameter';
import {HttpResponse} from './model/http-response';

export interface HttpClient {
    get(apiPath: string, params: EndpointParameter[]): Promise<HttpResponse>;
}