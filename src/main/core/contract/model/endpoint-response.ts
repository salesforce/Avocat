/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {ContentType} from '../enums/content-type';

export interface EndpointResponse {
    schema: object;
    contentType?: ContentType;
    description?: string;
    scenarioOverride?: string;
}