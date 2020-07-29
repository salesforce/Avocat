/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import {AvocatCommand} from '../model/avocat-command';
import {Command} from 'commander';
import {Inject, Service} from 'typedi';
import {Contract} from '../../../core/contract/model/contract';
import ImportService from '../../../core/import/import-service';
import {EventEmitter} from 'events';

@Service('import.command')
export default class ImportCommand implements AvocatCommand {
    public readonly name = 'import';
    public readonly options = [];

    constructor(@Inject('import.service') private importService: ImportService,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    includeInCLI(mainCommand: Command): void {
        mainCommand
            .command(this.name)
            .arguments('<contract_path>')
            .action((contractPath: string) => this.import(contractPath));
    }

    private import(contractPath: string): void {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('info', 'Running Import command');

        this.importService.importContract(contractPath)
            .then((contract: Contract) => console.log(`🤝 Contract ${contract.name} imported for version ${contract.version}, everything's fine.`))
            .catch(console.error);
    }

}