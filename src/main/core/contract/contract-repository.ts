/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {Contract} from './model/contract';

export interface ContractRepository {
    import(contractPath: string): Promise<Contract>;

    save(contract: Contract): Promise<string>;

    findAll(): Promise<Contract[]>;

    findByName(name: string): Promise<Contract[]>;

    findByVersion(version: string): Promise<Contract[]>;

    findByNameAndVersion(name: string, version: string): Promise<Contract>;
}