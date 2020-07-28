/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {Command} from 'commander';
import {EnvListCommand} from './env-list-command';
import {EnvironmentService} from '../../../../core/environment/environment-service';
import {EventEmitter} from 'events';
import {TestCliUtils} from '../../../../../test/utils/test-cli-utils';
import {EnvListRenderer} from '../../rendering/env-list-renderer';

describe('Env:List Command test', () => {
    let sut: EnvListCommand;
    let environmentServiceMock: EnvironmentService;
    let envListRendererMock: EnvListRenderer;
    let processExitMock: jest.SpyInstance;
    let loggingEventEmitterMock: EventEmitter;
    let mainCommand: Command;

    beforeEach(() => {
        environmentServiceMock = jest.genMockFromModule('../../../../core/environment/environment-service');
        envListRendererMock = jest.genMockFromModule('../../rendering/env-list-renderer');
        processExitMock = jest.spyOn(process, 'exit').mockImplementation();
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();
        mainCommand = new Command();
        mainCommand.description('testing env:list command');

        sut = new EnvListCommand(environmentServiceMock, envListRendererMock, loggingEventEmitterMock);
    });

    afterEach(() => {
        processExitMock.mockRestore();
    });

    describe('When including this command in the CLI', () => {
        it('CLI should contain the command name', () => {
            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'env:list')).not.toBeUndefined();
        });
    });

    describe('When calling this command from the CLI and no environments found', () => {
        it('Should call the renderer empty message', () => {
            environmentServiceMock.findAll = jest.fn().mockResolvedValueOnce([]);
            envListRendererMock.renderEmptyList = jest.fn();

            sut.includeInCLI(mainCommand);

            return TestCliUtils.runCommandFromCommander(mainCommand, sut.name).then(() => {
                expect(environmentServiceMock.findAll).toHaveBeenCalledTimes(1);
                expect(envListRendererMock.renderEmptyList).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('When calling this command from the CLI and some environments have been found', () => {
        it('Should call the renderer', () => {
            environmentServiceMock.findAll = jest.fn().mockResolvedValueOnce([{
                name: 'FAKE_ENV',
                url: 'http://www.example.com/',
                token: 'FAKE_TOKEN'
            }]);
            envListRendererMock.render = jest.fn();

            sut.includeInCLI(mainCommand);
            return TestCliUtils.runCommandFromCommander(mainCommand, sut.name).then(() => {
                expect(environmentServiceMock.findAll).toHaveBeenCalledTimes(1);
                expect(envListRendererMock.render).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('When calling this command from the CLI and an error has occurred', () => {
        it('Should not call the renderer', () => {
            environmentServiceMock.findAll = jest.fn().mockRejectedValueOnce('Promise reject mock from environmentService');
            envListRendererMock.render = jest.fn();
            envListRendererMock.renderEmptyList = jest.fn();

            sut.includeInCLI(mainCommand);
            return TestCliUtils.runCommandFromCommander(mainCommand, sut.name).then(() => {
                expect(environmentServiceMock.findAll).toHaveBeenCalledTimes(1);
                expect(envListRendererMock.render).toHaveBeenCalledTimes(0);
                expect(envListRendererMock.renderEmptyList).toHaveBeenCalledTimes(0);
            });
        });
    });
});