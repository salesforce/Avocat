/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import SwaggerParser from '@apidevtools/swagger-parser';
import {OpenAPI, OpenAPIV3} from 'openapi-types';
import {Inject, Service} from 'typedi';
import {Contract} from '../../../core/contract/model/contract';
import {ContractParser} from '../contract-parser';
import {SwaggerContractAdapter} from './adapter/swagger-contract-adapter';
import {EventEmitter} from 'events';

@Service('swagger-contract-parser.service')
export default class SwaggerContractParser implements ContractParser {

    constructor(@Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public async parse(contractPath: string): Promise<Contract> {
        this.loggingEE.emit('trace');

        const swaggerContract: OpenAPI.Document = await this.readAndValidate(contractPath);
        return new SwaggerContractAdapter(swaggerContract as OpenAPIV3.Document);
    }

    private readAndValidate = async (contractPath: string): Promise<OpenAPI.Document> => {
        try {
            this.loggingEE.emit('info', `Reading contract in path '${contractPath}', and validating its syntax...`);
            return await SwaggerParser.validate(contractPath);
        } catch (err) {
            return Promise.reject(err.message);
        }
    };
}