/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import {Inject, Service} from 'typedi';
import {FileStoreContractRepository} from '../../repository/file-store-contract-repository';
import {ContractRepository} from '../contract/contract-repository';
import {Contract} from '../contract/model/contract';

@Service('status.service')
export default class StatusService {

    constructor(@Inject(() => FileStoreContractRepository) private contractRepository: ContractRepository) {
    }

    public async getChangeList(): Promise<Contract[]> {
        return this.contractRepository.findAllNamesAndVersions();
    }
}