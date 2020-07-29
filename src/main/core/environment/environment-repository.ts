/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {Environment} from './model/environment';

export interface EnvironmentRepository {
    save(environment: Environment): Promise<string>;

    findAll(): Promise<Environment[]>;

    findByName(environmentName: string): Promise<Environment>;
}