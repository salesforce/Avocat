import {Contract} from '../../core/contract/model/contract';

export interface ContractSerializer {

    serialize(contract: Contract): string;
}