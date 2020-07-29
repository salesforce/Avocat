/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {AvocatCommand} from '../../model/avocat-command';
import {Command} from 'commander';
import {Inject, Service} from 'typedi';
import {EnvironmentService} from '../../../../core/environment/environment-service';
import {EventEmitter} from 'events';
import {Environment} from '../../../../core/environment/model/environment';
import {EnvListRenderer} from '../../rendering/env-list-renderer';

@Service('env-list.command')
export class EnvListCommand implements AvocatCommand {
    public readonly name = 'env:list';
    public readonly options = [];

    constructor(@Inject('environment.service') private environmentService: EnvironmentService,
                @Inject('env-list.renderer') private envListRenderer: EnvListRenderer,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public includeInCLI(mainCommand: Command): void {
        const envListCommand = mainCommand.command(this.name);
        envListCommand.action(() => this.getEnvironmentList());
    }

    private async getEnvironmentList(): Promise<void> {
        try {
            const environmentList: Environment[] = await this.environmentService.findAll();
            if (!environmentList.length) {
                this.envListRenderer.renderEmptyList();
                return;
            }
            this.envListRenderer.render(environmentList);
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }
}