/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import ImportService from './import-service';
import {Contract} from '../contract/model/contract';
import {ContractStatus} from '../contract/enums/contract-status';
import {ContractRepository} from '../contract/contract-repository';
import {EventEmitter} from 'events';

describe('Import service test', () => {
    const CONTRACT_PATH = './src/test/contracts-samples/test_sample_contract.yaml';
    let sut: ImportService;
    let contractRepositoryMock: ContractRepository;
    let loggingEventEmitterMock: EventEmitter;

    beforeEach(() => {
        contractRepositoryMock = jest.genMockFromModule('../contract/contract-repository');
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();
        sut = new ImportService(contractRepositoryMock, loggingEventEmitterMock);
    });

    describe('When calling import and the contract file syntax is valid', () => {
        it('Should return the contract object to ImportCommand', () => {
            contractRepositoryMock.import = jest.fn(() =>
                Promise.resolve({
                    version: '',
                    name: '',
                    status: ContractStatus.NOT_VERIFIED,
                    description: '',
                    endpoints: [],
                    servers: []
                }));
            return sut.importContract(CONTRACT_PATH).then((contract: Contract) => {
                expect(contract).not.toBeUndefined();
                expect(contractRepositoryMock.import).toHaveBeenCalledTimes(1);
            });
        });
    });
});