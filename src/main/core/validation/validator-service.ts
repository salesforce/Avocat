/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {ValidationResult} from './model/validation-result';

export interface ValidatorService {
    validateContractHavingNameAndVersion(contractName: string, contractVersion: string): AsyncGenerator<ValidationResult[]>;

    validateContractHavingName(contractName: string): AsyncGenerator<ValidationResult[]>;

    validateContractsHavingVersion(contractVersion: string): AsyncGenerator<ValidationResult[]>;
}