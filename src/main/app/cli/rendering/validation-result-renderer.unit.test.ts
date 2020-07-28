/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {ValidationResultRenderer} from './validation-result-renderer';
import {ValidationResult} from '../../../core/validation/model/validation-result';
import {HttpStatusCode} from '../../../core/contract/enums/http-status-code';
import {HttpMethod} from '../../../core/contract/enums/http-method';
import {ContractMapper} from '../../../core/contract/mapper/contract-mapper';
import {TestCliUtils} from '../../../../test/utils/test-cli-utils';
import {EventEmitter} from 'events';

describe('Validation Result Renderer test', () => {
    let outputMessages: string[];
    let consoleMock: typeof console;
    let loggingEventEmitterMock: EventEmitter;
    let validatorResultList: ValidationResult[];
    let sut: ValidationResultRenderer;

    const metadataFake = {
        contract: ContractMapper.mapNameAndVersionToContractObject('CONTRACT_NAME', 'CONTRACT_VERSION'),
        path: 'PATH',
        method: HttpMethod.GET,
        statusCode: HttpStatusCode.SUCCESS,
        hostURL: '',
        parameters: []
    };

    beforeEach(() => {
        outputMessages = [];
        consoleMock = jest.genMockFromModule('console');
        consoleMock.log = jest.fn().mockImplementation((message: string) => {
            outputMessages.push(message);
        });
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();

        sut = new ValidationResultRenderer(consoleMock, loggingEventEmitterMock);
    });

    describe('When render is called on an empty generator', () => {
        it('Should print no contracts found message', () => {
            validatorResultList = [];

            return sut.render(TestCliUtils.generatorMock(validatorResultList)).then(() => {
                expect(outputMessages.map(m => m.trim())).toStrictEqual([
                    '️Oops! no contracts found corresponding to entered criteria.',
                ]);
            });
        });
    });

    describe('When render is called on a nonempty generator that contain a valid result', () => {
        it('Should print the validated contract metadata with a status valid without any error', () => {
            validatorResultList = [{
                valid: true,
                errors: [],
                metadata: metadataFake,
            }];

            return sut.render(TestCliUtils.generatorMock(validatorResultList)).then(() => {
                expect(outputMessages.map(m => m.trim())).toStrictEqual([
                    '-----------------------------------------------------',
                    '🤝 CONTRACT_NAME: version CONTRACT_VERSION',
                    'PATH',
                    '✅  ' + HttpMethod.GET + ': ' + HttpStatusCode.SUCCESS
                ]);
            });
        });
    });

    describe('When render is called on a nonempty generator that contain an invalid and valid results', () => {
        it('Should print the validated contract metadata with a status valid without any error', () => {
            validatorResultList = [{
                valid: true,
                errors: [],
                metadata: metadataFake,
            }, {
                valid: false,
                errors: ['ERROR'],
                metadata: metadataFake,
            }];

            return sut.render(TestCliUtils.generatorMock(validatorResultList)).then(() => {
                expect(outputMessages.map(m => m.trim())).toStrictEqual([
                    '-----------------------------------------------------',
                    '🤝 CONTRACT_NAME: version CONTRACT_VERSION',
                    'PATH',
                    '✅  ' + HttpMethod.GET + ': ' + HttpStatusCode.SUCCESS,
                    'PATH',
                    '❌  ' + HttpMethod.GET + ': ' + HttpStatusCode.SUCCESS,
                    '- ERROR'
                ]);
            });
        });
    });
});