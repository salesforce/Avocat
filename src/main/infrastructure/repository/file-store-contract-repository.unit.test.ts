/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {ContractRepository} from '../../core/contract/contract-repository';
import {FileStoreContractRepository} from './file-store-contract-repository';
import {ContractParser} from '../parser/contract-parser';
import {ContractStatus} from '../../core/contract/enums/contract-status';
import {Contract} from '../../core/contract/model/contract';
import fs from 'fs';
import {ContractSerializer} from './serializer/contract-serializer';
import {ContractMapper} from '../../core/contract/mapper/contract-mapper';
import {EventEmitter} from 'events';

describe('File Store Contract repository test', () => {
    const VERSION = 'v1';
    const CONTRACT_1_NAME = 'contract 1 name';
    const CONTRACT_2_NAME = 'contract 2 name';
    let sut: ContractRepository;
    let swaggerContractParserMock: ContractParser;
    let fileSystemMock: typeof fs;
    let contractJsonSerializerMock: ContractSerializer;
    let loggingEventEmitterMock: EventEmitter;
    const contract1JsonFake = `
                {
                  "name": "${CONTRACT_1_NAME}",
                  "version": "${VERSION}",
                  "status": "NOT_VERIFIED",
                  "endpoints": []
                }`;

    const contract2JsonFake = `
                {
                  "name": "${CONTRACT_2_NAME}",
                  "version": "${VERSION}",
                  "status": "NOT_VERIFIED",
                  "endpoints": []
                }`;

    beforeEach(() => {
        fileSystemMock = jest.genMockFromModule('fs');
        fileSystemMock.promises = jest.genMockFromModule('fs');
        swaggerContractParserMock = jest.genMockFromModule('../parser/swagger/swagger-contract-parser');
        contractJsonSerializerMock = jest.genMockFromModule('./serializer/contract-serializer');
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();
        sut = new FileStoreContractRepository(
            fileSystemMock,
            swaggerContractParserMock,
            contractJsonSerializerMock,
            'FAKE_STORE_DIR',
            loggingEventEmitterMock
        );
    });

    describe('When import is called with a valid swagger contract path', () => {
        it('Should parse it into a contract object which will be returned eventually and save it as json file in the local store', () => {
            swaggerContractParserMock.parse = jest.fn(() =>
                Promise.resolve({
                    version: VERSION,
                    name: CONTRACT_1_NAME,
                    status: ContractStatus.NOT_VERIFIED,
                    endpoints: [],
                    servers: []
                }));
            contractJsonSerializerMock.serialize = jest.fn();

            return sut.import('dummy_contract_path').then((contract: Contract) => {
                expect(swaggerContractParserMock.parse).toHaveBeenCalledTimes(1);
                expect(contract).not.toBeUndefined();
                expect(contract).toMatchObject({name: CONTRACT_1_NAME, version: VERSION});
            });
        });
    });

    describe('When findAll is called', () => {
        it('Should return a list of all available contracts and versions in the local store', () => {
            fileSystemMock.promises.readdir = jest.fn()
                .mockReturnValueOnce([CONTRACT_1_NAME])
                .mockReturnValueOnce([VERSION]);

            return sut.findAll().then((contractsList: Contract[]) => {
                expect(contractsList).toHaveLength(1);
                expect(contractsList[0]).toMatchObject({name: CONTRACT_1_NAME, version: VERSION});
            });
        });

        it('Should return an ordered list by name and version', () => {
            fileSystemMock.promises.readdir = jest.fn()
                .mockReturnValueOnce(['contract name 2', 'contract name 1'])
                .mockReturnValueOnce(['contract 2 version 2', 'contract 2 version 1'])
                .mockReturnValueOnce(['contract 1 version 2', 'contract 1 version 1']);

            return sut.findAll().then((contractsList: Contract[]) => {
                expect(contractsList).toStrictEqual([
                    ContractMapper.mapNameAndVersionToContractObject('contract name 1', 'contract 1 version 1'),
                    ContractMapper.mapNameAndVersionToContractObject('contract name 1', 'contract 1 version 2'),
                    ContractMapper.mapNameAndVersionToContractObject('contract name 2', 'contract 2 version 1'),
                    ContractMapper.mapNameAndVersionToContractObject('contract name 2', 'contract 2 version 2'),
                ]);
            });
        });
    });

    describe('When findByName is called and a matching contract exists with 2 versions', () => {
        it('Should return a list of all contract versions in the local store', () => {
            fileSystemMock.promises.readdir = jest.fn()
                .mockReturnValueOnce(['contract 1 version 2', 'contract 1 version 1']);

            return sut.findByName(CONTRACT_1_NAME).then((contractsList: Contract[]) => {
                expect(contractsList).toStrictEqual(
                    ContractMapper.mapVersionsListToContractsList(CONTRACT_1_NAME, ['contract 1 version 2', 'contract 1 version 1'])
                );
            });
        });
    });

    describe('When findByVersion is called and 2 matching contract exist', () => {
        it('Should return a list of all contract versions in the local store', () => {
            fileSystemMock.promises.access = jest.fn()
                .mockReturnValueOnce(Promise.resolve(true))
                .mockReturnValueOnce(Promise.resolve(true))
                .mockReturnValueOnce(Promise.reject('Has not the version'));

            fileSystemMock.promises.readdir = jest.fn()
                .mockReturnValueOnce([CONTRACT_1_NAME, CONTRACT_2_NAME, 'CONTRACT_HAS_NOT_THE_VERSION']);

            fileSystemMock.promises.readFile = jest.fn()
                .mockReturnValueOnce(contract1JsonFake)
                .mockReturnValueOnce(contract2JsonFake);

            return sut.findByVersion(VERSION).then((contractsList: Contract[]) => {
                expect(fileSystemMock.promises.access).toHaveBeenCalledTimes(3);
                expect(fileSystemMock.promises.readFile).toHaveBeenCalledTimes(2);
                expect(contractsList).toStrictEqual([
                    ContractMapper.mapNameAndVersionToContractObject(CONTRACT_1_NAME, VERSION),
                    ContractMapper.mapNameAndVersionToContractObject(CONTRACT_2_NAME, VERSION)
                ]);
            });
        });
    });

    describe('When findByNameAndVersion is called and a matching contract exists', () => {
        it('Should return read and parse the targeted contract', () => {
            fileSystemMock.promises.readFile = jest.fn()
                .mockReturnValueOnce(contract1JsonFake);

            return sut.findByNameAndVersion(CONTRACT_1_NAME, VERSION).then((contractsList: Contract) => {
                expect(contractsList).toMatchObject(
                    ContractMapper.mapNameAndVersionToContractObject(CONTRACT_1_NAME, VERSION)
                );
            });
        });
    });
});