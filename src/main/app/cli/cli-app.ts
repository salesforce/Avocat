/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import chalk from 'chalk';
import figlet from 'figlet';
import {Inject, Service} from 'typedi';
import {Command} from 'commander';
import StatusCommand from './commands/status-command';
import {AvocatCommand} from './model/avocat-command';
import ImportCommand from './commands/import-command';
import {TestCommand} from './commands/test-command';

@Service()
export default class CliApp {

    private commands: AvocatCommand[];

    constructor(private mainCommand: Command,
                @Inject('status.command') private statusCommand: StatusCommand,
                @Inject('import.command') private importCommand: ImportCommand,
                @Inject('test.command') private testCommand: TestCommand) {
        this.commands = [
            statusCommand,
            importCommand,
            testCommand
        ];
    }

    public run(args: string[], version: string): void {
        this.mainCommand
            .name('avocat')
            .description('🥑 Continuous contract testing for HTTP APIs')
            .version(version, '-V, --Version', 'Avocat current version')
            .helpOption('-h, --help', 'Show available commands/options')
            .usage('[command] [options]');

        this.includeAvocatCommands();

        if (CliApp.emptyArguments(args)) {
            this.printDefaultHelpMessage();
            return;
        }

        this.mainCommand.parse(args);
    }

    private includeAvocatCommands(): void {
        this.commands.forEach(command => command.includeInCLI(this.mainCommand));
    }

    private printDefaultHelpMessage(): void {
        CliApp.drawAvocatBanner();
        this.mainCommand.outputHelp();
    }

    private static drawAvocatBanner(): void {
        console.log(
            chalk.greenBright(
                figlet.textSync('Avocat', {horizontalLayout: 'full'})
            )
        );
    }

    private static emptyArguments(args: string[]): boolean {
        return !args.slice(2).length;
    }
}