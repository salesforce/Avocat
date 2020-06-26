import {AjvContractValidator} from './ajv-contract-validator';
import {HttpStatusCode} from '../../../core/contract/enums/http-status-code';
import {ValidationResult} from '../../../core/validation/model/validation-result';
import {ValidationAttempt} from '../../../core/validation/model/validation-attempt';
import {HttpResponse} from '../../../core/http/model/http-response';
import {EventEmitter} from 'events';

describe('AJV Contract Validator test', () => {
    let loggingEventEmitterMock: EventEmitter;
    let sut: AjvContractValidator;
    const validResponse: HttpResponse = {statusCode: HttpStatusCode.SUCCESS, payload: {p1: 55}};
    const invalidResponseSchema: HttpResponse = {statusCode: HttpStatusCode.SUCCESS, payload: {p1: '55'}};
    const invalidResponseStatusCode: HttpResponse = {statusCode: HttpStatusCode.BAD_REQUEST, payload: {p1: 55}};
    const schema = {type: 'object', properties: {p1: {type: 'number'}}};

    beforeEach(() => {
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();
        sut = new AjvContractValidator(loggingEventEmitterMock);
    });

    describe('When validate is called with an object that corresponds to the schema', () => {
        it('Should return a valid ValidationResult with no errors', () => {
            const validationAttempt = new ValidationAttempt(HttpStatusCode.SUCCESS, schema, validResponse);

            return sut.validate(validationAttempt).then((validatorResult: ValidationResult) =>
                expect(validatorResult).toMatchObject({valid: true, errors: []})
            );
        });
    });

    describe('When validate is called with a response having data that doesnt correspond to the schema', () => {
        it('Should return an invalid ValidationResult with one error', () => {
            const validationAttempt = new ValidationAttempt(HttpStatusCode.SUCCESS, schema, invalidResponseSchema);

            return sut.validate(validationAttempt).then((validatorResult: ValidationResult) =>
                expect(validatorResult).toMatchObject({valid: false, errors: ['data.p1 should be number']})
            );
        });
    });

    describe('When validate is called with a response status code that doesnt correspond to the schema status code', () => {
        it('Should return an invalid ValidationResult with one error', () => {
            const validationAttempt = new ValidationAttempt(HttpStatusCode.SUCCESS, schema, invalidResponseStatusCode);

            return sut.validate(validationAttempt).then((validatorResult: ValidationResult) =>
                expect(validatorResult).toMatchObject({
                    valid: false,
                    errors: [`Expected ${HttpStatusCode.SUCCESS} status code, but found ${HttpStatusCode.BAD_REQUEST}`]
                })
            );
        });
    });

    describe('When validate is called with a response having response data that doesnt correspond to the schema', () => {
        it('Should return an invalid ValidationResult with one error', () => {
            const validationAttempt = new ValidationAttempt(HttpStatusCode.SUCCESS, schema, invalidResponseSchema);

            return sut.validate(validationAttempt).then((validatorResult: ValidationResult) =>
                expect(validatorResult).toMatchObject({
                    valid: false,
                    errors: [
                        'data.p1 should be number'
                    ]
                })
            );
        });
    });
});