/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import {Command} from 'commander';
import {AvocatCommand} from '../model/avocat-command';
import {Inject, Service} from 'typedi';
import StatusService from '../../../core/status/status-service';
import {Contract} from '../../../core/contract/model/contract';
import {EventEmitter} from 'events';

@Service('status.command')
export default class StatusCommand implements AvocatCommand {

    public readonly name = 'status';
    public readonly options = [];

    constructor(@Inject('status.service') private statusService: StatusService,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public includeInCLI(mainCommand: Command): void {
        mainCommand
            .command(this.name)
            .action(() => this.checkStatus());
    }

    private async checkStatus(): Promise<void> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('info', 'Running Status command');

        const changeList: Contract[] = await this.statusService.getChangeList();
        if (changeList.length === 0) {
            console.log('👌 Everything is up-to-date. No pending changes!');
            return;
        }

        this.printPendingChangeList(changeList);
    }

    private printPendingChangeList(changeList: Contract[]): void{
        const count = changeList.length === 1 ? 'One' : changeList.length;
        const contractAlias = changeList.length === 1 ? 'contract' : 'contracts';
        const aux = changeList.length === 1 ? 'is' : 'are';

        console.log(`👉 ${count} ${contractAlias} ${aux} pending:`);
        changeList.forEach((contract: Contract) => {
            console.log(`    * ${contract.name}, version ${contract.version}`);
        });
    }
}