import {ValidationResult} from './model/validation-result';
import {ValidationAttempt} from './model/validation-attempt';

export interface ContractValidator {
    validate(validationAttempt: ValidationAttempt): Promise<ValidationResult>;
}