/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {ValidationMetadata} from './validation-metadata';
import {ContractStatus} from '../../contract/enums/contract-status';
import {HttpStatusCode} from '../../contract/enums/http-status-code';
import {HttpMethod} from '../../contract/enums/http-method';

export interface ValidationResult {
    metadata: ValidationMetadata;
    valid: boolean;
    errors: string[];
}

export const validationResultComparator = (vr1: ValidationResult, vr2: ValidationResult): number =>
    vr1.metadata.contract.name.localeCompare(vr2.metadata.contract.name)
    || vr1.metadata.contract.version.localeCompare(vr2.metadata.contract.version)
    || vr1.metadata.path.localeCompare(vr2.metadata.path)
    || vr1.metadata.method.localeCompare(vr2.metadata.method)
    || vr1.metadata.statusCode.localeCompare(vr2.metadata.statusCode)
    || 0;

export class ValidationResultBuilder {
    private valid!: boolean;
    private errors!: string[];

    public withValidState(): ValidationResultBuilder {
        this.valid = true;
        this.errors = [];
        return this;
    }

    public withInValidState(errors?: string[]): ValidationResultBuilder {
        this.valid = false;
        this.errors = errors || [];
        return this;
    }

    public build(): ValidationResult {
        return {
            valid: this.valid,
            errors: [...this.errors],
            metadata: {
                contract: {
                    name: '',
                    version: '',
                    status: ContractStatus.NOT_VERIFIED,
                    endpoints: []
                },
                path: '',
                statusCode: HttpStatusCode.SUCCESS,
                method: HttpMethod.GET,
                parameters: []
            }
        };
    }
}