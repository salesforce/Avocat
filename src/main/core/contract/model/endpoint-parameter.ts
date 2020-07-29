/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {ParameterType} from '../enums/parameter-type';

export interface EndpointParameter {
    type: ParameterType;
    name: string;
    description?: string;
    required: boolean;
    schema: object;
    examples: string[];
}