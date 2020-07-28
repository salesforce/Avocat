import {ValidationResult} from './model/validation-result';

export interface ValidatorService {
    validateContractHavingNameAndVersion(contractName: string, contractVersion: string): AsyncGenerator<ValidationResult[]>;

    validateContractHavingName(contractName: string): AsyncGenerator<ValidationResult[]>;

    validateContractsHavingVersion(contractVersion: string): AsyncGenerator<ValidationResult[]>;
}