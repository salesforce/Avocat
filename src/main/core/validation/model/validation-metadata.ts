/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {Contract} from '../../contract/model/contract';
import {HttpMethod} from '../../contract/enums/http-method';
import {HttpStatusCode} from '../../contract/enums/http-status-code';
import {EndpointParameter} from '../../contract/model/endpoint-parameter';

export interface ValidationMetadata {
    contract: Contract;
    path: string;
    method: HttpMethod;
    parameters: EndpointParameter[];
    statusCode: HttpStatusCode;
}

export class ValidationMetadataBuilder {
    private readonly contract: Contract;
    private path = '';
    private method = HttpMethod.GET;
    private parameters: EndpointParameter[] = [];
    private statusCode = HttpStatusCode.SUCCESS;

    constructor(contract: Contract) {
        this.contract = contract;
    }

    public withPath(path: string): ValidationMetadataBuilder {
        this.path = path;
        return this;
    }

    public withStatusCode(statusCode: HttpStatusCode): ValidationMetadataBuilder {
        this.statusCode = statusCode;
        return this;
    }

    public withMethod(method: HttpMethod): ValidationMetadataBuilder {
        this.method = method;
        return this;
    }

    public withParameters(parameters: EndpointParameter[]): ValidationMetadataBuilder {
        this.parameters = parameters;
        return this;
    }

    public withScenarioOverride(path: string): ValidationMetadataBuilder{
        this.path = path;
        this.parameters = [];
        return this;
    }

    public build(): ValidationMetadata {
        return {
            contract: Object.assign({}, this.contract),
            path: this.path,
            statusCode: this.statusCode,
            method: this.method,
            parameters: [...this.parameters]
        };
    }
}