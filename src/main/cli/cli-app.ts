/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import {Command} from 'commander';
import {StatusCommand} from './commands/status-command';
import {AvocatCommand} from './commands/avocat-command';
import {Inject, Service} from 'typedi';

@Service()
export class CliApp {

    @Inject('status.command') private statusCommand!: StatusCommand;

    constructor(private mainCommand: Command) {
    }

    public run(args: string[], version: string): void {
        this.initMainCommand(version);

        this.includeAvocatCommands();

        if (CliApp.noProvidedArguments()) {
            this.printDefaultHelpMessage();
        } else {
            this.mainCommand.parse(args);
        }
    }

    private initMainCommand(version: string): void{
        this.mainCommand
            .description('🥑 Continuous contract testing for HTTP APIs')
            .version(version, '-v, --version', 'Avocat current version')
            .helpOption('-h, --help', 'Show available commands/options')
            .usage('[command] [options]');
    }

    private includeAvocatCommands(): void {
        this.getAvocatAvailableCommands().map(command => command.includeInCLI(this.mainCommand));
    }

    private getAvocatAvailableCommands(): AvocatCommand[] {
        return [this.statusCommand];
    }

    private printDefaultHelpMessage(): void {
        this.mainCommand.outputHelp();
    }

    private static noProvidedArguments(): boolean {
        return !process.argv.slice(2).length;
    }
}