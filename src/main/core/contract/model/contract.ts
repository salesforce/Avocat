import {Endpoint} from './endpoint';
import {ContractStatus} from '../enums/contract-status';

export interface Contract {
    version: string;
    name: string;
    status: ContractStatus;
    description?: string;
    endpoints: Endpoint[];
}

export const contractComparator = (c1: Contract, c2: Contract): number =>
    c1.name.localeCompare(c2.name) || c1.version.localeCompare(c2.version);
