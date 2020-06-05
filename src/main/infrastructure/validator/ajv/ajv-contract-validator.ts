import {Service} from 'typedi';
import {ContractValidator} from '../../../core/validator/contract-validator';
import {ValidationResult, ValidationResultBuilder} from '../../../core/validator/model/validation-result';
import Ajv, {Ajv as AjvInstance} from 'ajv';
import {HttpStatusCode} from '../../../core/contract/enums/http-status-code';
import {ValidationAttempt} from '../../../core/validator/model/validation-attempt';

@Service('ajv-contract.validator')
export class AjvContractValidator implements ContractValidator {

    public async validate(validationAttempt: ValidationAttempt): Promise<ValidationResult> {
        const ajv = new Ajv({allErrors: true});
        const schemaIsValid = await ajv.validate(
            validationAttempt.expectedSchema,
            validationAttempt.actualHttpResponse.payload
        );
        const statusCodeIsValid = this.validateStatusCode(
            validationAttempt.expectedStatusCode,
            validationAttempt.actualHttpResponse.statusCode
        );
        if (schemaIsValid && statusCodeIsValid) {
            return new ValidationResultBuilder()
                .withValidState()
                .build();
        }

        let errors: string[] = [];
        if (!statusCodeIsValid) {
            errors = [
                this.getStatusCodeErrorMessage(validationAttempt.expectedStatusCode, validationAttempt.actualHttpResponse.statusCode),
                ...errors
            ];
        } else if (!schemaIsValid) {
            errors = this.getAjvErrorMessages(ajv);
        }
        return new ValidationResultBuilder()
            .withInValidState(errors)
            .build();
    }

    private getAjvErrorMessages(ajv: AjvInstance,): string[] {
        return this.removeDuplicates(
            ajv.errorsText(ajv.errors, {separator: '||'})
                .split('||')
        );
    }

    private validateStatusCode = (schemaStatusCode: HttpStatusCode, httpResponseStatusCode: HttpStatusCode): boolean =>
        schemaStatusCode === httpResponseStatusCode;

    private getStatusCodeErrorMessage = (schemaStatusCode: HttpStatusCode, httpResponseStatusCode: HttpStatusCode): string =>
        `Expected ${schemaStatusCode} status code, but found ${httpResponseStatusCode}`;

    private removeDuplicates = (array: string[]): string[] => [...new Set(array)];
}