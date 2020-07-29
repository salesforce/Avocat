/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {Inject, Service} from 'typedi';
import {Environment} from './model/environment';
import {EventEmitter} from 'events';
import {EnvironmentRepository} from './environment-repository';
import {FileStoreEnvironmentRepository} from '../../infrastructure/repository/file-store-environment-repository';

@Service('environment.service')
export class EnvironmentService {

    constructor(@Inject(() => FileStoreEnvironmentRepository) private environmentRepository: EnvironmentRepository,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public addEnvironment(environmentToAdd: Environment): Promise<string> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('info', `Adding new environment '${environmentToAdd.name}'`);

        return this.environmentRepository.save(environmentToAdd);
    }

    public findAll(): Promise<Environment[]> {
        this.loggingEE.emit('trace');

        return this.environmentRepository.findAll();
    }

    public findByName(environmentName: string): Promise<Environment> {
        this.loggingEE.emit('trace');

        return this.environmentRepository.findByName(environmentName);
    }
}