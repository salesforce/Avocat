import StatusCommand from './status-command';
import {Command} from 'commander';
import {TestCliUtils} from '../../../test/utils/test-cli-utils';
import StatusService from '../../core/status/status-service';
import {ContractMapper} from '../../core/contract/model/contract';

describe('Status command test', () => {
    let sut: StatusCommand;
    let mainCommand: Command;
    let statusServiceMock: StatusService;

    beforeEach(() => {
        statusServiceMock = jest.genMockFromModule('../../core/status/status-service');
        sut = new StatusCommand(statusServiceMock);
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
            TestCliUtils.runCommand(mainCommand, sut.name);

            expect(statusServiceMock.getChangeList).toHaveBeenCalledTimes(1);
        });
    });

    describe('When calling this command from the CLI and there is one pending change', () => {
        it('Should print the pending changeList', () => {
            statusServiceMock.getChangeList = jest.fn(() => Promise.resolve([
                ContractMapper.mapToContractObject('contract 1', 'version 1.1'),
            ]));

            sut.includeInCLI(mainCommand);
            TestCliUtils.runCommand(mainCommand, sut.name);

            expect(statusServiceMock.getChangeList).toHaveBeenCalledTimes(1);
        });
    });

    describe('When calling this command from the CLI and there is multiple pending changes', () => {
        it('Should print the pending changeList', () => {
            statusServiceMock.getChangeList = jest.fn(() => Promise.resolve([
                ContractMapper.mapToContractObject('contract 1', 'version 1.1'),
                ContractMapper.mapToContractObject('contract 2', 'version 2.3'),
            ]));

            sut.includeInCLI(mainCommand);
            TestCliUtils.runCommand(mainCommand, sut.name);

            expect(statusServiceMock.getChangeList).toHaveBeenCalledTimes(1);
        });
    });
});