import {Contract} from './model/contract';

export interface ContractRepository {
    import(contractPath: string): Promise<Contract>;

    save(contract: Contract): Promise<string>;

    findAllNamesAndVersions(): Promise<Contract[]>;
}