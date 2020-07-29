/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {Command} from 'commander';
import {TestCommand} from './test-command';
import {AvocatCommandOption} from '../model/avocat-command-option';
import {TestCliUtils} from '../../../../test/utils/test-cli-utils';
import {Spinner} from 'cli-spinner';
import {ValidatorService} from '../../../core/validation/validator-service';
import {ValidationResultRenderer} from '../rendering/validation-result-renderer';
import {EventEmitter} from 'events';
import {ApplicationContext} from '../../config/application-context';
import {EnvironmentService} from '../../../core/environment/environment-service';

describe('Test command test', () => {
    let sut: TestCommand;
    let mainCommand: Command;
    let validatorServiceMock: ValidatorService;
    let validatorResultRenderer: ValidationResultRenderer;
    let spinnerMock: Spinner;
    let loggingEventEmitterMock: EventEmitter;
    let applicationContextMock: ApplicationContext;
    let environmentServiceMock: EnvironmentService;
    const FAKE_URL = 'http://example.com';
    const FAKE_INVALID_URL = 'FAKE_URL';
    const FAKE_NAME = 'FAKE_NAME';
    const FAKE_VERSION = 'FAKE_VERSION';
    const FAKE_ENV_NAME = 'ENV1';
    const FAKE_ENV = {name: FAKE_ENV_NAME, url: 'URL', token: 'TOKEN'};

    beforeEach(() => {
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();
        validatorResultRenderer = new ValidationResultRenderer(console, loggingEventEmitterMock);
        validatorServiceMock = jest.genMockFromModule('../../../core/validation/validator-service');
        environmentServiceMock = jest.genMockFromModule('../../../core/environment/environment-service');
        applicationContextMock = jest.genMockFromModule('../../config/application-context');
        applicationContextMock.set = jest.fn();
        spinnerMock = jest.genMockFromModule('cli-spinner');
        spinnerMock.setSpinnerTitle = jest.fn();
        spinnerMock.setSpinnerString = jest.fn();
        spinnerMock.start = jest.fn();
        spinnerMock.stop = jest.fn();

        sut = new TestCommand(applicationContextMock, validatorServiceMock, validatorResultRenderer, environmentServiceMock, spinnerMock, loggingEventEmitterMock);
        mainCommand = new Command();
        mainCommand.description('testing test command');
    });

    describe('When including this command in the CLI', () => {
        it('CLI should contain the command name', () => {
            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'test')).not.toBeUndefined();
        });

        it('CLI should contain the command options', () => {
            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'test').options
                .map(AvocatCommandOption.fromCommanderOption)
            ).toStrictEqual(sut.options);
        });
    });

    describe('Environment and URL params test', () => {
        beforeEach(() => {
            validatorServiceMock.validateContractHavingName = jest.fn();
            validatorServiceMock.validateContractsHavingVersion = jest.fn();
            validatorServiceMock.validateContractHavingNameAndVersion = jest.fn();
        });

        describe('When calling test command with environment param and the environment exists', () => {
            it('Should call environmentService to fetch the environment', () => {
                environmentServiceMock.findByName = jest.fn().mockResolvedValueOnce(FAKE_ENV);
                sut.includeInCLI(mainCommand);

                return TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--env', FAKE_ENV_NAME, '--name', FAKE_NAME, '--version', FAKE_VERSION)
                    .then(() =>
                        expect(environmentServiceMock.findByName).toHaveBeenCalledTimes(1)
                    );
            });
        });

        describe('When calling test command with environment param and the environment doesnt exists', () => {
            it('Should not call the validation methods', () => {
                environmentServiceMock.findByName = jest.fn().mockRejectedValueOnce('Env Not Found!');
                sut.includeInCLI(mainCommand);

                TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--env', 'INVALID_NAME', '--name', FAKE_NAME, '--version', FAKE_VERSION);

                expect(validatorServiceMock.validateContractHavingName).toHaveBeenCalledTimes(0);
                expect(validatorServiceMock.validateContractsHavingVersion).toHaveBeenCalledTimes(0);
                expect(validatorServiceMock.validateContractHavingNameAndVersion).toHaveBeenCalledTimes(0);
            });
        });

        describe('When calling test command with a valid url param', () => {
            it('Should not call the envService to fetch an environment', () => {
                environmentServiceMock.findByName = jest.fn().mockResolvedValueOnce(FAKE_ENV);
                sut.includeInCLI(mainCommand);

                TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--url', FAKE_URL, '--name', FAKE_NAME, '--version', FAKE_VERSION);

                expect(environmentServiceMock.findByName).toHaveBeenCalledTimes(0);
            });
        });

        describe('When calling test command with an invalid url param', () => {
            it('Should not call the validation methods', () => {
                sut.includeInCLI(mainCommand);

                TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--url', FAKE_INVALID_URL, '--name', FAKE_NAME, '--version', FAKE_VERSION);

                expect(validatorServiceMock.validateContractHavingName).toHaveBeenCalledTimes(0);
                expect(validatorServiceMock.validateContractsHavingVersion).toHaveBeenCalledTimes(0);
                expect(validatorServiceMock.validateContractHavingNameAndVersion).toHaveBeenCalledTimes(0);
            });
        });

        describe('When calling test command with either an environment or a url', () => {
            it('Should not call the validation methods', () => {
                sut.includeInCLI(mainCommand);

                TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--name', FAKE_NAME, '--version', FAKE_VERSION);

                expect(validatorServiceMock.validateContractHavingName).toHaveBeenCalledTimes(0);
                expect(validatorServiceMock.validateContractsHavingVersion).toHaveBeenCalledTimes(0);
                expect(validatorServiceMock.validateContractHavingNameAndVersion).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe('Name and Version params test', () => {
        describe('When calling test command with name and version params', () => {
            it('Should call validatorService.validateContractHavingNameAndVersion method', () => {
                sut.includeInCLI(mainCommand);

                validatorServiceMock.validateContractHavingNameAndVersion = jest.fn().mockImplementationOnce((): AsyncGenerator<string> =>
                    TestCliUtils.generatorMock('validateContractHavingNameAndVersion Mocked')
                );

                return TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--url', FAKE_URL, '--name', FAKE_NAME, '--version', FAKE_VERSION)
                    .then(() => {
                        expect(validatorServiceMock.validateContractHavingNameAndVersion).toHaveBeenCalledTimes(1);
                    });
            });
        });

        describe('When calling test command with only name param', () => {
            it('Should call validatorService.validateContractHavingName method', () => {
                sut.includeInCLI(mainCommand);

                validatorServiceMock.validateContractHavingName = jest.fn().mockImplementationOnce((): AsyncGenerator<string> =>
                    TestCliUtils.generatorMock('validateContractHavingName Mocked')
                );

                return TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--url', FAKE_URL, '--name', FAKE_NAME)
                    .then(() => {
                        expect(validatorServiceMock.validateContractHavingName).toHaveBeenCalledTimes(1);
                    });
            });
        });

        describe('When calling test command with only version param', () => {
            it('Should call validatorService.validateContractsHavingVersion method', () => {
                sut.includeInCLI(mainCommand);

                validatorServiceMock.validateContractsHavingVersion = jest.fn().mockImplementationOnce((): AsyncGenerator<string> =>
                    TestCliUtils.generatorMock('validateContractsHavingVersion Mocked')
                );

                return TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--url', FAKE_URL, '--version', FAKE_VERSION)
                    .then(() =>
                        expect(validatorServiceMock.validateContractsHavingVersion).toHaveBeenCalledTimes(1)
                    );
            });
        });

        describe('When calling test command with no name neither version', () => {
            it('Should perform no validation', () => {
                sut.includeInCLI(mainCommand);

                validatorServiceMock.validateContractHavingName = jest.fn();
                validatorServiceMock.validateContractsHavingVersion = jest.fn();
                validatorServiceMock.validateContractHavingNameAndVersion = jest.fn();

                TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--url', FAKE_URL);

                expect(validatorServiceMock.validateContractHavingName).toHaveBeenCalledTimes(0);
                expect(validatorServiceMock.validateContractsHavingVersion).toHaveBeenCalledTimes(0);
                expect(validatorServiceMock.validateContractHavingNameAndVersion).toHaveBeenCalledTimes(0);
            });
        });
    });
});