/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import {Inject, Service} from 'typedi';
import {FileStoreContractRepository} from '../../infrastructure/repository/file-store-contract-repository';
import {ContractRepository} from '../contract/contract-repository';
import {Contract} from '../contract/model/contract';
import {EventEmitter} from 'events';

@Service('status.service')
export default class StatusService {

    constructor(@Inject(() => FileStoreContractRepository) private contractRepository: ContractRepository,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public async getChangeList(): Promise<Contract[]> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('info', 'Looking for the current change list...');

        return this.contractRepository.findAll();
    }
}