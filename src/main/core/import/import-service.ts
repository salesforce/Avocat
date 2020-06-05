/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import {Inject, Service} from 'typedi';
import {Contract} from '../contract/model/contract';
import {ContractRepository} from '../contract/contract-repository';
import {FileStoreContractRepository} from '../../infrastructure/repository/file-store-contract-repository';

@Service('import.service')
export default class ImportService {

    constructor(@Inject(() => FileStoreContractRepository) private contractRepository: ContractRepository) {
    }

    public async importContract(contractPath: string): Promise<Contract> {
        return this.contractRepository.import(contractPath);
    }
}