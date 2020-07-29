/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {Container, Service} from 'typedi';
import fileSystem from 'fs';
import path from 'path';
import {LoglevelLogger} from '../../infrastructure/logging/loglevel-logger';
import {Logger} from 'loglevel';
import {EventEmitter} from 'events';

@Service('application.context')
export class ApplicationContext {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public set = (values: { id: string; value: any }[]): Container => Container.set(values);

    public get<T>(id: string): T {
        return Container.get<T>(id);
    }

    public async prepareStore(): Promise<ApplicationContext> {
        const contractsStoreDir = Container.get<string>('contracts-store-dir');
        const environmentsStoreDir = Container.get<string>('environments-store-dir');
        await Promise.all([
            this.createDirRecursively(contractsStoreDir),
            this.createDirRecursively(environmentsStoreDir)
        ]);
        return this;
    }

    private createDirRecursively(dir: string): Promise<void | string> {
        return fileSystem.promises.mkdir(path.resolve(dir), {recursive: true})
            .catch(err => {
                throw new Error(`Can't create the directory ${dir}: ` + err.message);
            });
    }

    public prepareLogger(): ApplicationContext {
        const logger = Container.get<Logger>('logger');
        const loggerEventEmitter = Container.get<EventEmitter>('logging-event-emitter');
        const loglevelLogger = new LoglevelLogger(loggerEventEmitter, logger);
        loglevelLogger.subscribeToEmitter();
        return this;
    }
}