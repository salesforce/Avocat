import {StatusCommand} from './status-command';
import {Command} from 'commander';
import {Container} from 'typedi';
import {Status} from '../../core/status/status';


describe('Status command test', () => {
    let sut: StatusCommand;
    let mainCommand: Command;
    let status: Status;

    beforeAll(() => {
        const StatusMock = jest.fn(() => ({
            getChangeList: jest.fn().mockImplementation(() => {
                return [];
            })
        }));
        status = new StatusMock();
        sut = new StatusCommand(status);
        mainCommand = Container.get(Command);
    });

    describe('When including this command in the CLI', () => {
        it('CLI should contain the command name', () => {
            mainCommand.description('testing status command');

            sut.includeInCLI(mainCommand);

            expect(mainCommand.commands.find((command: Command) => command.name() === 'status')).not.toBeUndefined();
        });
    });

    describe('When calling this command from the CLI', () => {
        it('Should return the current changeList status', () => {
            mainCommand.description('testing status command');
            sut.includeInCLI(mainCommand);

            mainCommand.parse(['ts-node', './src/main/index.ts', 'status']);

            expect(status.getChangeList).toHaveBeenCalled();
        });
    });
});