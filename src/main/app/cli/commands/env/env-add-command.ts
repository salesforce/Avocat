import {AvocatCommand} from '../../model/avocat-command';
import {AvocatCommandOption} from '../../model/avocat-command-option';
import {Command} from 'commander';
import {Inject, Service} from 'typedi';
import {EnvironmentService} from '../../../../core/environment/environment-service';
import {Environment} from '../../../../core/environment/model/environment';
import {EventEmitter} from 'events';

@Service('env-add.command')
export class EnvAddCommand implements AvocatCommand {
    public readonly name = 'env:add';
    public readonly options: AvocatCommandOption[] = [
        new AvocatCommandOption(
            '--name',
            '-n',
            '<name>',
            true,
            '(required) Environment name'
        ), new AvocatCommandOption(
            '--url',
            '-u',
            '<url>',
            true,
            '(required) Environment url in which the APIs are hosted e.g. https://www.example.com/'
        ), new AvocatCommandOption(
            '--token',
            '-t',
            '<token>',
            true,
            '(required) Authorization token to access the APIs'
        )
    ];

    constructor(@Inject('environment.service') private environmentService: EnvironmentService,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public includeInCLI(mainCommand: Command): void {
        const envAddCommand = mainCommand
            .command(this.name)
            .storeOptionsAsProperties(false)
            .passCommandToAction(false);

        this.options.forEach((option: AvocatCommandOption) =>
            envAddCommand.requiredOption(option.getCLIFormat(), option.description));

        envAddCommand.action(passedOptions => {
            const environment: Environment = this.parseEnvOptions(passedOptions);
            this.validateAndAddEnv(environment);
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private parseEnvOptions = (options: any): Environment => ({
        name: options.name,
        url: options.url,
        token: options.token
    });

    private validateAndAddEnv(environmentToAdd: Environment): void {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('info', 'Running Env:Add command');

        if (this.validateURL(environmentToAdd.url)) {
            this.environmentService
                .addEnvironment(environmentToAdd)
                .then(() => console.log(`🤝 Environment '${environmentToAdd.name}' added! Now you can use it in your tests.`))
                .catch(console.error);
        }
    }

    private validateURL = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            console.error(e.message);
            return false;
        }
    }
}