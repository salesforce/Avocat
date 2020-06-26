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
import {Logger, LogLevelDesc} from 'loglevel';

@Service()
export default class CliApp {
    private static readonly ALLOWED_LOG_LEVELS = 'TRACE|DEBUG|INFO|WARN|ERROR|SILENT';
    private static readonly INVALID_ARGUMENT = 9;

    private commands: AvocatCommand[];

    constructor(private mainCommand: Command,
                @Inject('logger') private logger: Logger,
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

        this.addLogLevelOption();
        this.includeAvocatCommands();

        if (this.emptyArguments(args)) {
            this.printDefaultHelpMessage();
            return;
        }

        this.mainCommand.parse(args);
    }

    private addLogLevelOption(): void {
        this.mainCommand
            .option('--loglevel <level>',
                `Specify the log level. Allowed values: ${CliApp.ALLOWED_LOG_LEVELS}`,
                'SILENT'
            )
            .addListener('option:loglevel', (loglevel: LogLevelDesc) => {
                try {
                    this.logger.setDefaultLevel(loglevel);
                } catch (e) {
                    console.error(`Invalid loglevel. Allowed values: ${CliApp.ALLOWED_LOG_LEVELS}`);
                    process.exit(CliApp.INVALID_ARGUMENT);
                }
            });
    }

    private includeAvocatCommands(): void {
        this.commands.forEach(command => command.includeInCLI(this.mainCommand));
    }

    private printDefaultHelpMessage(): void {
        this.drawAvocatBanner();
        this.mainCommand.outputHelp();
    }

    private drawAvocatBanner = (): void =>
        console.log(
            chalk.greenBright(
                figlet.textSync('Avocat', {horizontalLayout: 'full'})
            )
        );

    private emptyArguments = (args: string[]): boolean => !args.slice(2).length;
}