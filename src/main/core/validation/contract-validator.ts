/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {ValidationResult} from './model/validation-result';
import {ValidationAttempt} from './model/validation-attempt';

export interface ContractValidator {
    validate(validationAttempt: ValidationAttempt): Promise<ValidationResult>;
}