/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {Inject, Service} from 'typedi';
import {EnvironmentRepository} from '../../core/environment/environment-repository';
import {Environment} from '../../core/environment/model/environment';
import fs from 'fs';
import {EventEmitter} from 'events';
import path from 'path';

@Service('file-store-environment.repository')
export class FileStoreEnvironmentRepository implements EnvironmentRepository {

    constructor(@Inject('fs') private fileSystem: typeof fs,
                @Inject('environments-store-dir') private readonly environmentsStoreDir: string,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public async save(environment: Environment): Promise<string> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('debug', `Saving the environment '${environment.name}' to the store...`);

        if (await this.alreadyExists(environment.name)) {
            return Promise.reject(`Error: Environment with the name '${environment.name}' already exists`);
        }

        const envFileDir = path.join(this.environmentsStoreDir, environment.name);
        await this.fileSystem.promises.writeFile(envFileDir, JSON.stringify(environment), {encoding: 'utf8'});
        this.loggingEE.emit('info', `Environment '${environment.name}' saved successfully in '${envFileDir}'!`);
        return envFileDir;
    }

    private async alreadyExists(name: string): Promise<boolean> {
        const environmentNamesList: string[] = await this.fileSystem.promises.readdir(this.environmentsStoreDir);
        return environmentNamesList.find(environmentName => environmentName === name) !== undefined;
    }

    public async findAll(): Promise<Environment[]> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('info', 'Looking for all environments in the store');

        const environmentsNamesList: string[] = await this.fileSystem.promises.readdir(this.environmentsStoreDir);
        this.loggingEE.emit('info', `Environments found: {${environmentsNamesList}}`);
        return Promise.all(environmentsNamesList.map(this.findByName));
    }

    public findByName = (environmentName: string): Promise<Environment> => {
        this.loggingEE.emit('info', `Loading environment '${environmentName}' from store...`);

        const environmentFileDir = path.join(this.environmentsStoreDir, environmentName);
        return this.fileSystem.promises
            .readFile(environmentFileDir, {encoding: 'utf8'})
            .then(environmentFileContent => JSON.parse(environmentFileContent) as Environment)
            .catch(e => Promise.reject(`Error loading environment file (${environmentFileDir}): ${e.message}`));
    }
}