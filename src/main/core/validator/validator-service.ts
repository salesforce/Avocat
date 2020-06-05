import {ValidationResult} from './model/validation-result';

export interface ValidatorService {
    validateContractHavingNameAndVersion(hostURL: string, contractName: string, contractVersion: string): AsyncGenerator<ValidationResult[]>;

    validateContractHavingName(hostURL: string, contractName: string): AsyncGenerator<ValidationResult[]>;

    validateContractsHavingVersion(hostURL: string, contractVersion: string): AsyncGenerator<ValidationResult[]>;
}