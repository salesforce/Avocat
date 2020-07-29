/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

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
import {ApplicationContext} from '../../config/application-context';
import {EnvironmentService} from '../../../core/environment/environment-service';

declare type TestCommandOptions = { env: string; url: string; name: string; version: string };

@Service('test.command')
export class TestCommand implements AvocatCommand {
    public readonly name = 'test';
    public readonly options: AvocatCommandOption[] = [
        new AvocatCommandOption(
            '--url',
            '-u',
            '<url>',
            false,
            '(optional) Server url in which the APIs are hosted e.g. https://www.example.com/'
        ), new AvocatCommandOption(
            '--env',
            '-e',
            '<env>',
            false,
            '(optional) Environment to run tests on'
        ), new AvocatCommandOption(
            '--name',
            '-n',
            '<name>',
            false,
            '(optional) Specify a contract name to run tests e.g. "Search Mru"'
        ), new AvocatCommandOption(
            '--version',
            '-v',
            '<version>',
            false,
            '(optional) Specify a contract version to run tests on e.g. v49'
        ),
    ];

    constructor(@Inject('application.context') private applicationContext: ApplicationContext,
                @Inject(() => ValidatorServiceImpl) private validatorService: ValidatorService,
                @Inject('validation-result.renderer') private validationResultRenderer: ValidationResultRenderer,
                @Inject('environment.service') private environmentService: EnvironmentService,
                @Inject('spinner') private spinner: Spinner,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public includeInCLI(mainCommand: Command): void {
        const testCommand = mainCommand.command(this.name);

        this.options.forEach((option: AvocatCommandOption) =>
            testCommand.option(option.getCLIFormat(), option.description));

        testCommand.action(async passedOptions => {
            try {
                const testCommandOptions = this.parseOptions(passedOptions);
                if (this.validateRequiredOptions(testCommandOptions)) {
                    await this.setUpContext(testCommandOptions);
                    this.startSpinner();
                    await this.validateAndRenderResults(testCommandOptions);
                }
            } catch (e) {
                console.error(e.message || e);
            } finally {
                this.stopSpinner();
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private parseOptions = (options: any): TestCommandOptions => ({
        url: options.url,
        env: options.env,
        name: typeof options.name === 'string' ? options.name : undefined,
        version: typeof options.version === 'string' ? options.version : undefined
    });

    private validateRequiredOptions = (testCommandOptions: TestCommandOptions): boolean => {
        if (!testCommandOptions.env && !testCommandOptions.url) {
            throw new Error('Missing argument, please provide an environment name or a host URL to run tests');
        }
        if (!testCommandOptions.name && !testCommandOptions.version) {
            throw new Error('Insufficient criteria, please provide a contract name or version');
        }
        this.loggingEE.emit('debug', 'Required options validated');
        return true;
    }

    private setUpContext(testCommandOptions: TestCommandOptions): Promise<void> | void {
        if (testCommandOptions.env) {
            return this.addEnvironmentToContext(testCommandOptions.env);
        } else if (testCommandOptions.url) {
            this.addUrlAndTokenToContext(testCommandOptions.url);
        }
    }

    private async addEnvironmentToContext(environmentName: string): Promise<void> {
        const environment = await this.environmentService.findByName(environmentName);
        this.loggingEE.emit('debug', `Running tests on environment '${environment.name} (${environment.url})'`);
        this.applicationContext.set([
            {id: 'host-url', value: environment.url},
            {id: 'auth-token', value: environment.token}
        ]);
    }

    private addUrlAndTokenToContext(url: string): void {
        const validURL = new URL(url);
        this.loggingEE.emit('debug', `Running tests on URL '${validURL.href}'`);
        this.applicationContext.set([
            {id: 'host-url', value: validURL.href},
            {id: 'auth-token', value: process.env.SID}
        ]);
    }

    private async validateAndRenderResults(testCommandOptions: TestCommandOptions): Promise<void> {
        this.loggingEE.emit('trace');
        this.loggingEE.emit('info', 'Running Test command');

        const validationResults = this.validate(testCommandOptions.name, testCommandOptions.version);
        await this.validationResultRenderer.render(validationResults);
    }

    private validate(name: string, version: string): AsyncGenerator<ValidationResult[]> {
        if (name && version) {
            return this.validatorService.validateContractHavingNameAndVersion(name, version);
        }
        if (name) {
            return this.validatorService.validateContractHavingName(name);
        }
        return this.validatorService.validateContractsHavingVersion(version);
    }

    private startSpinner(): void {
        this.spinner.setSpinnerTitle('👉 Testing... %s');
        this.spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
        this.spinner.start();
    }

    private stopSpinner(): void {
        this.spinner.stop();
    }
}