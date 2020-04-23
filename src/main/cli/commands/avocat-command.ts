import {Command} from 'commander';

export interface AvocatCommand {
    name: string;
    options: string[];

    includeInCLI(mainCommand: Command): void;
}

