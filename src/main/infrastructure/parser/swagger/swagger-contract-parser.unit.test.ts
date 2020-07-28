/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import SwaggerContractParser from './swagger-contract-parser';
import {Contract} from '../../../core/contract/model/contract';
import {EventEmitter} from 'events';

describe('Swagger contracts service test', () => {
    let loggingEventEmitterMock: EventEmitter;
    let sut: SwaggerContractParser;

    const CONTRACT_PATH = './src/test/contracts-samples/test_sample_contract.yaml';
    beforeEach(async () => {
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();

        sut = new SwaggerContractParser(loggingEventEmitterMock);
    });

    describe('When parse method is called and the contract exists and its syntax is valid', () => {
        it('Should parse the swagger contract into a nonempty Contract object', () => {
            return sut.parse(CONTRACT_PATH).then((contract: Contract) => {
                expect(contract).not.toBeUndefined();
            });
        });
    });

    describe('When parse method is called and the contract could not found', () => {
        it('Should throw ENOENT: Error opening file error', () => {
            return sut.parse(CONTRACT_PATH + 'invalid_path').catch((error) => {
                expect(error).toContain('Error opening file');
            });
        });
    });
});