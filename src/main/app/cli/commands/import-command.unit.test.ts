import {Command} from 'commander';
import ImportCommand from './import-command';
import {ContractStatus} from '../../../core/contract/enums/contract-status';
import {TestCliUtils} from '../../../../test/utils/test-cli-utils';
import ImportService from '../../../core/import/import-service';

describe('Import command test', () => {
    let sut: ImportCommand;
    let mainCommand: Command;
    let importServiceMock: ImportService;

    beforeEach(() => {
        importServiceMock = jest.genMockFromModule('../../../core/import/import-service');
        sut = new ImportCommand(importServiceMock);
        mainCommand = new Command();
        mainCommand.description('testing import command');
    });

    describe('When including this command in the CLI', () => {
        it('CLI should contain the command name', () => {

            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'import')).not.toBeUndefined();
        });
    });

    describe('When calling this command from the CLI', () => {
        it('Should import the provided contract into the local repository', () => {
            importServiceMock.importContract = jest.fn(() =>
                Promise.resolve({
                    version: '',
                    name: '',
                    status: ContractStatus.NOT_VERIFIED,
                    description: '',
                    endpoints: [],
                    servers: []
                }));

            sut.includeInCLI(mainCommand);
            TestCliUtils.runCommandFromCommander(mainCommand, sut.name, 'dummy_contract_path');

            expect(importServiceMock.importContract).toHaveBeenCalledTimes(1);
        });
    });
});