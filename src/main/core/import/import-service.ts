/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import {Inject, Service} from 'typedi';
import {Contract} from '../contract/model/contract';
import {ContractRepository} from '../contract/contract-repository';
import {FileStoreContractRepository} from '../../infrastructure/repository/file-store-contract-repository';
import {EventEmitter} from 'events';

@Service('import.service')
export default class ImportService {

    constructor(@Inject(() => FileStoreContractRepository) private contractRepository: ContractRepository,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public async importContract(contractPath: string): Promise<Contract> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('debug',`Contract in path '${contractPath}' is being imported...`);

        return this.contractRepository.import(contractPath);
    }
}