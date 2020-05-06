import {Endpoint} from './endpoint';
import {ContractStatus} from '../enums/contract-status';

export interface Contract {
    version: string;
    name: string;
    status: ContractStatus;
    description?: string;
    components?: object;
    endpoints: Endpoint[];
}

export class ContractMapper {
    public static mapToContractObject(name: string, version: string): Contract {
        return {
            name,
            version,
            status: ContractStatus.NOT_VERIFIED,
            endpoints: []
        };
    }

    public static mapToContractList(name: string, versions: string[]): Contract[] {
        return versions.map(version => ContractMapper.mapToContractObject(name, version));
    }
}