/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {EndpointParameter} from '../../../../core/contract/model/endpoint-parameter';
import {OpenAPIV3} from 'openapi-types';
import {ParameterType} from '../../../../core/contract/enums/parameter-type';

export class SwaggerEndpointParameterAdapter implements EndpointParameter {
    constructor(private parameter: OpenAPIV3.ParameterObject) {
    }

    get type(): ParameterType {
        return this.parameter.in.toLowerCase() as ParameterType;
    }

    get name(): string {
        return this.parameter.name;
    }

    get description(): string {
        return this.parameter.description || '';
    }

    get required(): boolean {
        return this.parameter.required || false;
    }

    get schema(): object {
        return this.parameter.schema || {};
    }

    get examples(): string[] {
        const allExamples = this.getExamplesAsArray(this.parameter.examples);
        if (this.parameter.example) {
            allExamples.push(this.parameter.example);
        }
        return allExamples;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getExamplesAsArray(examples: any): string[] {
        if (!examples) return [];
        return Object.entries(examples).map(([, example]) => (example as OpenAPIV3.ExampleObject).value as string);
    }
}