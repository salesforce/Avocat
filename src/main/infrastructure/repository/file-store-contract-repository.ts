import {ContractRepository} from '../../core/contract/contract-repository';
import {Inject, Service} from 'typedi';
import {Contract, contractComparator} from '../../core/contract/model/contract';
import SwaggerContractParser from '../parser/swagger/swagger-contract-parser';
import {ContractParser} from '../parser/contract-parser';
import ContractJsonSerializer from './serializer/json/contract-json-serializer';
import {ContractSerializer} from './serializer/contract-serializer';
import fs from 'fs';
import path from 'path';
import {ContractMapper} from '../../core/contract/mapper/contract-mapper';
import {EventEmitter} from 'events';

@Service('file-store-contract.repository')
export class FileStoreContractRepository implements ContractRepository {

    constructor(@Inject('fs') private fileSystem: typeof fs,
                @Inject(() => SwaggerContractParser) private contractParser: ContractParser,
                @Inject(() => ContractJsonSerializer) private contractSerializer: ContractSerializer,
                @Inject('contracts-store-dir') private readonly contractsStoreDir: string,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public async import(contractPath: string): Promise<Contract> {
        this.loggingEE.emit('trace');

        const contract = await this.contractParser.parse(contractPath);
        this.loggingEE.emit('debug',`Contract '${contract.name}' version ${contract.version} parsed successfully!`);

        await this.save(contract);

        return contract;
    }

    public async save(contract: Contract): Promise<string> {
        this.loggingEE.emit('trace');

        const contractDir = path.join(this.contractsStoreDir, contract.name);
        this.loggingEE.emit('debug',`Writing contract version '${contract.version}' in the directory '${contractDir}'...`);
        await this.createFileAndDirectories(contractDir, contract.version, this.contractSerializer.serialize(contract));
        this.loggingEE.emit('info',`Contract '${contract.name}' version ${contract.version} saved to local store successfully!`);

        return contractDir;
    }

    private async createFileAndDirectories(pathToFile: string, name: string, content: string): Promise<void> {
        await this.fileSystem.promises.mkdir(pathToFile, {recursive: true});
        return this.fileSystem.promises.writeFile(path.join(pathToFile, name), content, {encoding: 'utf8'});
    }

    public async findAll(): Promise<Contract[]> {
        this.loggingEE.emit('trace');

        this.loggingEE.emit('debug','Looking for all contracts in the local store...');
        const allContractsNames: string[] = await this.readDirectory(this.contractsStoreDir);
        this.loggingEE.emit('info',`Contracts found: {${allContractsNames}}`);

        return Promise.all(allContractsNames.map(this.findByName))
            .then(this.flattenContracts)
            .then(contracts => [...contracts].sort(contractComparator));
    }

    private flattenContracts = (contractsList: Contract[][]): Contract[] =>
        Array.prototype.concat(...contractsList);

    public findByName = async (contractName: string): Promise<Contract[]> => {
        this.loggingEE.emit('trace');

        this.loggingEE.emit('debug',`Looking for all of '${contractName}' versions in the local store...`);
        const versions = await this.readDirectory(path.join(this.contractsStoreDir, contractName));
        this.loggingEE.emit('info',`Contract '${contractName}' versions found: {${versions}}`);

        return ContractMapper
            .mapVersionsListToContractsList(contractName, versions);
    };

    public findByVersion = async (contractVersion: string): Promise<Contract[]> => {
        this.loggingEE.emit('trace');

        this.loggingEE.emit('debug','Looking for all contracts in the local store...');
        const allContractsNames = await this.readDirectory(this.contractsStoreDir);
        this.loggingEE.emit('debug',`Contracts found: {${allContractsNames}}`);

        this.loggingEE.emit('debug',`Filtering contracts not having version ${contractVersion}...`);
        const filteredContractsNames = await this.filterContractsNotHavingVersion(allContractsNames, contractVersion);
        this.loggingEE.emit('info',`Contracts found: {${filteredContractsNames}}`);

        return Promise.all(
            filteredContractsNames
                .map(contractName => this.findByNameAndVersion(contractName, contractVersion))
        );
    };

    private async readDirectory(contractPath: string): Promise<string[]> {
        return this.fileSystem.promises.readdir(contractPath, {encoding: 'utf8'});
    }

    private async filterContractsNotHavingVersion(contractsNamesList: string[], version: string): Promise<string[]> {
        const res = [];
        for await (const contractName of this.filterAsync(contractsNamesList, version)) {
            res.push(contractName);
        }
        return res;
    }

    private async* filterAsync(list: string[], version: string): AsyncIterable<string> {
        for (const name of list) {
            if (await this.contractHasVersion(name, version)) {
                yield name;
            }
        }
    }

    private async contractHasVersion(name: string, version: string): Promise<boolean> {
        return await this.fileSystem.promises.access(path.join(this.contractsStoreDir, name, version))
            .then(() => true)
            .catch(() => false);
    }

    public findByNameAndVersion(name: string, version: string): Promise<Contract> {
        this.loggingEE.emit('trace');

        return this.readFile(path.join(this.contractsStoreDir, name, version))
            .then(ContractMapper.mapJsonToContractObject);
    }

    private async readFile(contractPath: string): Promise<string> {
        return this.fileSystem.promises.readFile(contractPath, {encoding: 'utf8'});
    }
}