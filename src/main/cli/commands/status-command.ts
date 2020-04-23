/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import {Command} from 'commander';
import {AvocatCommand} from './avocat-command';
import {Status} from '../../core/status/status';
import {Inject, Service} from 'typedi';

@Service('status.command')
export class StatusCommand implements AvocatCommand {

    public readonly name = 'status';
    public readonly options = [];

    constructor(@Inject('status.service') private status: Status) {
    }

    public includeInCLI(mainCommand: Command): void {
        mainCommand
            .command(this.name)
            .action(() => {
                console.log(this.checkStatus());
            });
    }

    private checkStatus(): string {
        this.status.getChangeList();
        return '👌 Everything is up-to-date. No pending changes!';
    }
}