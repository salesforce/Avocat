import {ContractRepository} from '../core/contract/contract-repository';
import {FileStoreContractRepository} from './file-store-contract-repository';
import {ContractParser} from '../parsing/contract-parser';
import {ContractStatus} from '../core/contract/enums/contract-status';
import {Contract, ContractMapper} from '../core/contract/model/contract';
import fs from 'fs';
import {ContractSerializer} from './serializer/contract-serializer';

describe('File Store Contract repository test', () => {
    const VERSION = '2.2.2';
    const NAME = 'TEST_CONTRACT';
    let sut: ContractRepository;
    let swaggerContractParserMock: ContractParser;
    let fileSystemMock: typeof fs;
    let contractJsonSerializerMock: ContractSerializer;

    beforeEach(() => {
        fileSystemMock = jest.genMockFromModule('fs');
        fileSystemMock.promises = jest.genMockFromModule('fs');
        swaggerContractParserMock = jest.genMockFromModule('../parsing/swagger/swagger-contract-parser');
        contractJsonSerializerMock = jest.genMockFromModule('./serializer/contract-serializer');
        sut = new FileStoreContractRepository(fileSystemMock, swaggerContractParserMock, contractJsonSerializerMock, 'FAKE_STORE_DIR');
    });

    describe('When import is called with a valid swagger contract path', () => {
        it('Should parse it into a contract object which will be returned eventually and save it as json file in the local store', () => {
            swaggerContractParserMock.parse = jest.fn(() =>
                Promise.resolve({
                    version: VERSION,
                    name: NAME,
                    status: ContractStatus.NOT_VERIFIED,
                    endpoints: [],
                    servers: []
                }));
            contractJsonSerializerMock.serialize = jest.fn();

            return sut.import('dummy_contract_path').then((contract: Contract) => {
                expect(swaggerContractParserMock.parse).toHaveBeenCalledTimes(1);
                expect(contract).not.toBeUndefined();
                expect(contract).toMatchObject({name: NAME, version: VERSION});
            });
        });
    });

    describe('When findAll is called', () => {
        it('Should return a list of all available contracts and versions in the local store', () => {
            fileSystemMock.promises.readdir = jest.fn();
            (fileSystemMock.promises.readdir as jest.Mock)
                .mockReturnValueOnce([NAME])
                .mockReturnValueOnce([VERSION]);

            return sut.findAllNamesAndVersions().then((contractsList: Contract[]) => {
                expect(contractsList).toHaveLength(1);
                expect(contractsList[0]).toMatchObject({name: NAME, version: VERSION});
            });
        });

        it('Should return an ordered list by name and version', () => {
            fileSystemMock.promises.readdir = jest.fn();
            (fileSystemMock.promises.readdir as jest.Mock)
                .mockReturnValueOnce(['contract name 2', 'contract name 1'])
                .mockReturnValueOnce(['contract 2 version 2', 'contract 2 version 1'])
                .mockReturnValueOnce(['contract 1 version 2', 'contract 1 version 1']);

            return sut.findAllNamesAndVersions().then((contractsList: Contract[]) => {
                expect(contractsList).toStrictEqual([
                    ContractMapper.mapToContractObject('contract name 1', 'contract 1 version 1'),
                    ContractMapper.mapToContractObject('contract name 1', 'contract 1 version 2'),
                    ContractMapper.mapToContractObject('contract name 2', 'contract 2 version 1'),
                    ContractMapper.mapToContractObject('contract name 2', 'contract 2 version 2'),
                ]);
            });
        });
    });
});