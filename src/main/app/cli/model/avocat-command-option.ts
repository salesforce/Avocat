import {Option} from 'commander';

export class AvocatCommandOption {
    public name: string;
    public shortName: string;
    public argument: string;
    public required: boolean;
    public description: string;

    constructor(name: string, shortName: string, argument: string, required: boolean, description: string) {
        this.name = name;
        this.shortName = shortName;
        this.argument = argument;
        this.required = required;
        this.description = description;
    }

    public getCLIFormat(): string {
        return this.shortName + ', ' + this.name + ' ' + this.argument;
    }

    public static fromCommanderOption(option: Option): AvocatCommandOption {
        return new AvocatCommandOption(
            option.long,
            option.short || '',
            AvocatCommandOption.getOptionArgumentFormat(option),
            option.mandatory,
            option.description
        );
    }

    private static getOptionArgumentFormat = (option: Option): string => `<${option.long.replace(/--/g, '')}>`;
}