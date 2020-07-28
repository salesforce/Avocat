/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {Command} from 'commander';
import {AvocatCommandOption} from './avocat-command-option';

export interface AvocatCommand {
    name: string;
    options: AvocatCommandOption[];

    includeInCLI(mainCommand: Command): void;
}

