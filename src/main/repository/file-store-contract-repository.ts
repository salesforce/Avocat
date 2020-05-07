import {ContractRepository} from '../core/contract/contract-repository';
import {Inject, Service} from 'typedi';
import {Contract, ContractMapper} from '../core/contract/model/contract';
import SwaggerContractParser from '../parsing/swagger/swagger-contract-parser';
import {ContractParser} from '../parsing/contract-parser';
import ContractJsonSerializer from './serializer/json/contract-json-serializer';
import {ContractSerializer} from './serializer/contract-serializer';
import fs from 'fs';

@Service('file-store-contract.repository')
export class FileStoreContractRepository implements ContractRepository {
    public readonly FILE_REPOSITORY_DIR = './local-store/';

    constructor(@Inject('fs') private fileSystem: typeof fs,
                @Inject(() => SwaggerContractParser) private contractParser: ContractParser,
                @Inject(() => ContractJsonSerializer) private contractSerializer: ContractSerializer) {
    }

    public async import(contractPath: string): Promise<Contract> {
        const contract = await this.contractParser.parse(contractPath);
        this.save(contract);
        return contract;
    }

    public async save(contract: Contract): Promise<string> {
        const contractDir = this.getContractDir(contract.name);
        await this.createFileAndDirectories(contractDir, contract.version, this.contractSerializer.serialize(contract));
        return contractDir;
    }

    private getContractDir(contractName: string): string {
        return this.FILE_REPOSITORY_DIR + contractName + '/';
    }

    private async createFileAndDirectories(path: string, name: string, content: string): Promise<void> {
        await this.fileSystem.promises.mkdir(path, {recursive: true});
        return this.fileSystem.promises.writeFile(path + '/' + name, content, {encoding: 'utf8'});
    }

    public async findAllNamesAndVersions(): Promise<Contract[]> {
        const contractsNames: string[] = await this.loadAllContracts();
        return Promise.all(
            contractsNames.map(this.loadAllVersions)
        ).then(this.flattenAndSortContracts);
    }

    private loadAllContracts(): Promise<string[]> {
        return this.readDirectory(this.FILE_REPOSITORY_DIR);
    }

    private loadAllVersions = async (contractName: string): Promise<Contract[]> => {
        const versions = await this.readDirectory(this.FILE_REPOSITORY_DIR + contractName);
        return ContractMapper.mapToContractList(contractName, versions);
    };

    private async readDirectory(path: string): Promise<string[]> {
        return this.fileSystem.promises.readdir(path, {encoding: 'utf8'});
    }

    private flattenAndSortContracts = (contractsList: Contract[][]): Contract[] => contractsList
        .reduce((all: Contract[], current) => all.concat(current), [])
        .sort((c1: Contract, c2: Contract) => c1.name.localeCompare(c2.name) || c1.version.localeCompare(c2.version));
}