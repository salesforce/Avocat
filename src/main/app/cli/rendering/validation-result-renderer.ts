/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {ValidationResult, validationResultComparator} from '../../../core/validation/model/validation-result';
import {Inject, Service} from 'typedi';
import {EventEmitter} from 'events';
import {indentation} from './indentation';

@Service('validation-result.renderer')
export class ValidationResultRenderer {

    constructor(@Inject('output-stream') private outputStream: typeof console,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public render = async (generator: AsyncGenerator<ValidationResult[]>): Promise<void> => {
        this.loggingEE.emit('trace');

        let emptyResults = true;
        for await (const validationResultList of generator) {
            if (!validationResultList.length) {
                this.loggingEE.emit('warn', 'Empty validation result list!');
                continue;
            }

            this.loggingEE.emit('debug', `Rendering validation result for contract '${validationResultList[0].metadata.contract.name}'...`);
            emptyResults = false;
            this.outputStream.log('\n-----------------------------------------------------');
            this.outputStream.log(`🤝 ${validationResultList[0].metadata.contract.name}: version ${validationResultList[0].metadata.contract.version}`);
            const validationResultSortedList = [...validationResultList].sort(validationResultComparator);
            this.renderValidationResultList(validationResultSortedList);
        }
        if (emptyResults) {
            this.outputStream.log('\n️Oops! no contracts found corresponding to entered criteria.');
        }
    };

    private renderValidationResultList = (validationResultList: ValidationResult[]): void =>
        validationResultList.forEach(validationResult => {
            this.outputStream.log(indentation() + validationResult.metadata.path);
            this.outputStream.log(indentation(1) + `${validationResult.valid ? '✅' : '❌'}  ${validationResult.metadata.method}: ${validationResult.metadata.statusCode}`);
            this.renderErrorsList(validationResult.errors);
        });

    private renderErrorsList = (errors: string[]): void => errors.forEach(error => this.outputStream.log(indentation(2) + `- ${error}`));
}