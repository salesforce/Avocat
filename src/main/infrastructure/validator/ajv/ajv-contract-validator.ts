import {Inject, Service} from 'typedi';
import {ContractValidator} from '../../../core/validation/contract-validator';
import {ValidationResult, ValidationResultBuilder} from '../../../core/validation/model/validation-result';
import Ajv, {Ajv as AjvInstance} from 'ajv';
import {ValidationAttempt} from '../../../core/validation/model/validation-attempt';
import {EventEmitter} from 'events';

@Service('ajv-contract.validator')
export class AjvContractValidator implements ContractValidator {

    constructor(@Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public async validate(validationAttempt: ValidationAttempt): Promise<ValidationResult> {
        this.loggingEE.emit('trace');

        const ajv = new Ajv({allErrors: true, nullable: true});

        this.loggingEE.emit('debug', `Validating schema for endpointResponse '${validationAttempt.expectedStatusCode}'...`);
        const schemaIsValid: boolean = await this.validateSchema(ajv, validationAttempt);

        this.loggingEE.emit('debug', `Validating status code for endpointResponse '${validationAttempt.expectedStatusCode}'...`);
        const statusCodeIsValid = this.validateStatusCode(validationAttempt);

        if (schemaIsValid && statusCodeIsValid) {
            return new ValidationResultBuilder()
                .withValidState()
                .build();
        }

        let errors: string[] = [];
        if (!statusCodeIsValid) {
            errors = [this.getStatusCodeErrorMessage(validationAttempt)];
            this.loggingEE.emit('debug', `Status code is not valid, errors: [${errors}]`);
        } else if (!schemaIsValid) {
            errors = this.getAjvErrorMessages(ajv);
            this.loggingEE.emit('debug', `Schema is not valid, errors: [${errors}]`);
        }
        return new ValidationResultBuilder()
            .withInValidState(errors)
            .build();
    }

    private validateSchema = async (ajv: AjvInstance, validationAttempt: ValidationAttempt): Promise<boolean> => {
        try {
            return await ajv.validate(
                validationAttempt.expectedSchema,
                validationAttempt.actualHttpResponse.payload
            );
        } catch (e) {
            this.loggingEE.emit('error', `AJV Error: [${e.message}]`);
            return false;
        }
    };

    private getAjvErrorMessages(ajv: AjvInstance): string[] {
        return this.removeDuplicates(
            ajv.errorsText(ajv.errors, {separator: '||'})
                .split('||')
        );
    }

    private validateStatusCode = (validationAttempt: ValidationAttempt): boolean =>
        validationAttempt.expectedStatusCode === validationAttempt.actualHttpResponse.statusCode;

    private getStatusCodeErrorMessage = (validationAttempt: ValidationAttempt): string =>
        `Expected ${validationAttempt.expectedStatusCode} status code, but found ${validationAttempt.actualHttpResponse.statusCode}`;

    private removeDuplicates = (array: string[]): string[] => [...new Set(array)];
}