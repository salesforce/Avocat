import {Command} from 'commander';
import {AvocatCommandOption} from './avocat-command-option';

export interface AvocatCommand {
    name: string;
    options: AvocatCommandOption[];

    includeInCLI(mainCommand: Command): void;
}

