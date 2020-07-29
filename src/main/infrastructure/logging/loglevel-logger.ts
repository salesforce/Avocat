/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {Inject, Service} from 'typedi';
import {EventEmitter} from 'events';
import {Logger} from 'loglevel';

@Service('loglevel-logger')
export class LoglevelLogger {

    public constructor(@Inject('logging-event-emitter') private loggingEventEmitter: EventEmitter,
                @Inject('logger') private logger: Logger) {
    }

    public subscribeToEmitter(): void {
        this.loggingEventEmitter.on('trace', (...messages: string[]) => this.logger.trace(this.format('trace', messages)));
        this.loggingEventEmitter.on('debug', (...messages: string[]) => this.logger.debug(this.format('debug', messages)));
        this.loggingEventEmitter.on('info', (...messages: string[]) => this.logger.info(this.format('info', messages)));
        this.loggingEventEmitter.on('warn', (...messages: string[]) => this.logger.warn(this.format('warn', messages)));
        this.loggingEventEmitter.on('error', (...messages: string[]) => this.logger.error(this.format('error', messages)));
    }

    private format= (level: string, messages: string[]): string =>
        `${new Date().toISOString()} :: ${level.toUpperCase()} :: ${messages.join(' :: ')}`;
}
