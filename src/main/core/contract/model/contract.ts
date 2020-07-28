/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {Endpoint} from './endpoint';
import {ContractStatus} from '../enums/contract-status';

export interface Contract {
    version: string;
    name: string;
    status: ContractStatus;
    description?: string;
    endpoints: Endpoint[];
}

export const contractComparator = (c1: Contract, c2: Contract): number =>
    c1.name.localeCompare(c2.name) || c1.version.localeCompare(c2.version);
