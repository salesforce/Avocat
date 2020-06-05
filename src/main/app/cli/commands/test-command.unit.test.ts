import {Command, Option} from 'commander';
import {TestCommand} from './test-command';
import {AvocatCommandOption} from '../model/avocat-command-option';
import {TestCliUtils} from '../../../../test/utils/test-cli-utils';
import {Spinner} from 'cli-spinner';
import {ValidatorService} from '../../../core/validator/validator-service';
import {ValidationResultRenderer} from '../rendering/validation-result-renderer';

describe('Test command test', () => {
    let sut: TestCommand;
    let mainCommand: Command;
    let validatorServiceMock: ValidatorService;
    let validatorResultRenderer: ValidationResultRenderer;
    let spinnerMock: Spinner;
    const FAKE_URL = 'FAKE_URL';
    const FAKE_NAME = 'FAKE_NAME';
    const FAKE_VERSION = 'FAKE_VERSION';

    beforeEach(() => {
        validatorServiceMock = jest.genMockFromModule('../../../core/validator/validator-service');
        validatorResultRenderer = new ValidationResultRenderer(console);
        spinnerMock = jest.genMockFromModule('cli-spinner');
        spinnerMock.setSpinnerTitle = jest.fn();
        spinnerMock.setSpinnerString = jest.fn();
        spinnerMock.start = jest.fn();
        spinnerMock.stop = jest.fn();
        sut = new TestCommand(validatorServiceMock, validatorResultRenderer, spinnerMock);
        mainCommand = new Command();
        mainCommand.description('testing test command');
    });

    const getOptionArgumentFormat = (option: Option): string => `<${option.long.replace(/--/g, '')}>`;
    const toAvocatCommandOption = (option: Option): AvocatCommandOption => ({
        name: option.long,
        shortName: option.short || '',
        argument: getOptionArgumentFormat(option),
        required: option.mandatory,
        description: option.description
    });

    describe('When including this command in the CLI', () => {
        it('CLI should contain the command name', () => {
            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'test')).not.toBeUndefined();
        });

        it('CLI should contain the command options', () => {
            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'test').options
                .map(toAvocatCommandOption)
            ).toStrictEqual(sut.options);
        });
    });

    describe('When calling test command with name and version params', () => {
        it('Should call validatorService.validateContractHavingNameAndVersion method', () => {
            sut.includeInCLI(mainCommand);

            validatorServiceMock.validateContractHavingNameAndVersion = jest.fn().mockImplementationOnce((): AsyncGenerator<string> =>
                TestCliUtils.generatorMock('validateContractHavingNameAndVersion Mocked')
            );

            TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--url', FAKE_URL, '--name', FAKE_NAME, '--version', FAKE_VERSION);

            expect(validatorServiceMock.validateContractHavingNameAndVersion).toHaveBeenCalledTimes(1);
        });
    });

    describe('When calling test command with only name param', () => {
        it('Should call validatorService.validateContractHavingName method', () => {
            sut.includeInCLI(mainCommand);

            validatorServiceMock.validateContractHavingName = jest.fn().mockImplementationOnce((): AsyncGenerator<string> =>
                TestCliUtils.generatorMock('validateContractHavingName Mocked')
            );

            TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--url', FAKE_URL, '--name', FAKE_NAME);

            expect(validatorServiceMock.validateContractHavingName).toHaveBeenCalledTimes(1);
        });
    });

    describe('When calling test command with only version param', () => {
        it('Should call validatorService.validateContractsHavingVersion method', () => {
            sut.includeInCLI(mainCommand);

            validatorServiceMock.validateContractsHavingVersion = jest.fn().mockImplementationOnce((): AsyncGenerator<string> =>
                TestCliUtils.generatorMock('validateContractsHavingVersion Mocked')
            );

            TestCliUtils.runCommandFromCommander(mainCommand, sut.name, '--url', FAKE_URL, '--version', FAKE_VERSION);

            expect(validatorServiceMock.validateContractsHavingVersion).toHaveBeenCalledTimes(1);
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