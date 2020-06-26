import {AvocatCommand} from '../model/avocat-command';
import {Command} from 'commander';
import {AvocatCommandOption} from '../model/avocat-command-option';
import {Inject, Service} from 'typedi';
import {ValidationResult} from '../../../core/validation/model/validation-result';
import {ValidationResultRenderer} from '../rendering/validation-result-renderer';
import {Spinner} from 'cli-spinner';
import {ValidatorService} from '../../../core/validation/validator-service';
import {ValidatorServiceImpl} from '../../../core/validation/impl/validator-service-impl';
import {EventEmitter} from 'events';

@Service('test.command')
export class TestCommand implements AvocatCommand {
    public readonly name = 'test';
    public readonly options: AvocatCommandOption[] = [
        {
            name: '--url',
            shortName: '-u',
            argument: '<url>',
            required: true,
            description: 'Server url in which the APIs are hosted e.g. https://www.example.com/'
        },
        {
            name: '--name',
            shortName: '-n',
            argument: '<name>',
            required: false,
            description: 'Specify a contract name to run tests on e.g. "Search Mru"'
        },
        {
            name: '--version',
            shortName: '-v',
            argument: '<version>',
            required: false,
            description: 'Specify a contract version to run tests on e.g. v49'
        },
    ];

    constructor(@Inject(() => ValidatorServiceImpl) private validatorService: ValidatorService,
                @Inject('validation-result.renderer') private validationResultRenderer: ValidationResultRenderer,
                @Inject('spinner') private spinner: Spinner,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public includeInCLI(mainCommand: Command): void {
        const testCommand = mainCommand
            .command(this.name)
            .helpOption('-h, --help', 'Show available options');

        this.options.forEach((option: AvocatCommandOption) =>
            option.required
                ? testCommand.requiredOption(this.getOptionFormat(option), option.description)
                : testCommand.option(this.getOptionFormat(option), option.description));

        testCommand.action(passedOptions => this.test(passedOptions));
    }

    private async test(passedOptions: object): Promise<void> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('info', 'Running Test command');

        const {url, name, version} = this.parseOptions(passedOptions);

        if (!name && !version) {
            console.warn('Insufficient criteria, please provide a contract name or version');
            return;
        }

        this.startSpinner();
        try {
            let validationResults: AsyncGenerator<ValidationResult[]>;
            if (name && version) {
                validationResults = this.validatorService.validateContractHavingNameAndVersion(url, name, version);
            } else if (name) {
                validationResults = this.validatorService.validateContractHavingName(url, name);
            } else {
                validationResults = this.validatorService.validateContractsHavingVersion(url, version);
            }
            await this.validationResultRenderer.render(validationResults);
        } catch (e) {
            console.error(e.message);
        }
        this.stopSpinner();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private parseOptions = (options: any): { url: string; name: string; version: string } => ({
        url: options.url,
        name: typeof options.name === 'string' ? options.name : undefined,
        version: typeof options.version === 'string' ? options.version : undefined
    });

    private getOptionFormat = (option: AvocatCommandOption): string =>
        option.shortName + ', ' + option.name + ' ' + option.argument;

    private startSpinner(): void {
        this.spinner.setSpinnerTitle('👉 Testing... %s');
        this.spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
        this.spinner.start();
    }

    private stopSpinner(): void {
        this.spinner.stop();
    }
}