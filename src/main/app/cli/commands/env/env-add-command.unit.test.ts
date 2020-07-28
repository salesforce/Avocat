/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {Command} from 'commander';
import {EnvAddCommand} from './env-add-command';
import {TestCliUtils} from '../../../../../test/utils/test-cli-utils';
import {AvocatCommandOption} from '../../model/avocat-command-option';
import {EnvironmentService} from '../../../../core/environment/environment-service';
import {EventEmitter} from 'events';

describe('Env:Add Command test', () => {
    let mainCommand: Command;
    let environmentServiceMock: EnvironmentService;
    let loggingEventEmitterMock: EventEmitter;
    let sut: EnvAddCommand;
    const FAKE_URL = 'http://www.example.com/';
    const INVALID_URL = 'INVALID_URL';
    const FAKE_TOKEN = 'FAKE_TOKEN';
    const FAKE_NAME = 'FAKE_NAME';

    beforeEach(() => {
        environmentServiceMock = jest.genMockFromModule('../../../../core/environment/environment-service');
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();
        mainCommand = new Command();
        mainCommand.description('testing env:add command');

        sut = new EnvAddCommand(environmentServiceMock, loggingEventEmitterMock);
    });

    describe('When including this command in the CLI', () => {
        it('CLI should contain the command name', () => {
            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'env:add')).not.toBeUndefined();
        });

        it('CLI should contain the command options', () => {
            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'env:add').options
                .map(AvocatCommandOption.fromCommanderOption)
            ).toStrictEqual(sut.options);
        });
    });

    describe('When calling environment command with url and token params', () => {
        it('Should call the service add method', () => {
            environmentServiceMock.addEnvironment = jest.fn().mockReturnValueOnce(Promise.resolve());
            sut.includeInCLI(mainCommand);

            TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--name', FAKE_NAME, '--url', FAKE_URL, '--token', FAKE_TOKEN);

            expect(environmentServiceMock.addEnvironment).toHaveBeenCalledTimes(1);
        });
    });

    describe('When calling environment command with an invalid url', () => {
        it('Should not call the service', () => {
            environmentServiceMock.addEnvironment = jest.fn().mockReturnValueOnce(Promise.reject());
            sut.includeInCLI(mainCommand);

            TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--name', FAKE_NAME, '--url', INVALID_URL, '--token', FAKE_TOKEN);

            expect(environmentServiceMock.addEnvironment).toHaveBeenCalledTimes(0);
        });
    });
});