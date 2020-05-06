import {Contract} from '../core/contract/model/contract';

export interface ContractParser {
    parse(contractPath: string): Promise<Contract>;
}