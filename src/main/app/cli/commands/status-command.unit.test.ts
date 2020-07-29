/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import StatusCommand from './status-command';
import {Command} from 'commander';
import {TestCliUtils} from '../../../../test/utils/test-cli-utils';
import StatusService from '../../../core/status/status-service';
import {ContractMapper} from '../../../core/contract/mapper/contract-mapper';
import {EventEmitter} from 'events';

describe('Status command test', () => {
    let sut: StatusCommand;
    let mainCommand: Command;
    let statusServiceMock: StatusService;
    let loggingEventEmitterMock: EventEmitter;

    beforeEach(() => {
        statusServiceMock = jest.genMockFromModule('../../../core/status/status-service');
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();
        sut = new StatusCommand(statusServiceMock, loggingEventEmitterMock);
        mainCommand = new Command();
        mainCommand.description('testing status command');
    });

    describe('When including this command in the CLI', () => {
        it('CLI should contain the command name', () => {

            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'status')).not.toBeUndefined();
        });
    });

    describe('When calling this command from the CLI and no pending changes', () => {
        it('Should print no pending changes', () => {
            statusServiceMock.getChangeList = jest.fn(() => Promise.resolve([]));

            sut.includeInCLI(mainCommand);
            TestCliUtils.runCommandFromCommander(mainCommand, sut.name);

            expect(statusServiceMock.getChangeList).toHaveBeenCalledTimes(1);
        });
    });

    describe('When calling this command from the CLI and there is one pending change', () => {
        it('Should print the pending changeList', () => {
            statusServiceMock.getChangeList = jest.fn(() => Promise.resolve([
                ContractMapper.mapNameAndVersionToContractObject('contract 1', 'version 1.1'),
            ]));

            sut.includeInCLI(mainCommand);
            TestCliUtils.runCommandFromCommander(mainCommand, sut.name);

            expect(statusServiceMock.getChangeList).toHaveBeenCalledTimes(1);
        });
    });

    describe('When calling this command from the CLI and there is multiple pending changes', () => {
        it('Should print the pending changeList', () => {
            statusServiceMock.getChangeList = jest.fn(() => Promise.resolve([
                ContractMapper.mapNameAndVersionToContractObject('contract 1', 'version 1.1'),
                ContractMapper.mapNameAndVersionToContractObject('contract 2', 'version 2.3'),
            ]));

            sut.includeInCLI(mainCommand);
            TestCliUtils.runCommandFromCommander(mainCommand, sut.name);

            expect(statusServiceMock.getChangeList).toHaveBeenCalledTimes(1);
        });
    });
});