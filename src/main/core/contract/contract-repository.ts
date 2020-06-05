import {Contract} from './model/contract';

export interface ContractRepository {
    import(contractPath: string): Promise<Contract>;

    save(contract: Contract): Promise<string>;

    findAll(): Promise<Contract[]>;

    findByName(name: string): Promise<Contract[]>;

    findByVersion(version: string): Promise<Contract[]>;

    findByNameAndVersion(name: string, version: string): Promise<Contract>;
}