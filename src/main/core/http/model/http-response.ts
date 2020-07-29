/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {HttpStatusCode} from '../../contract/enums/http-status-code';

export interface HttpResponse {
    statusCode: HttpStatusCode;
    payload: object;
    error?: string;
}