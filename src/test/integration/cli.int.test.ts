/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {TestCliUtils} from '../utils/test-cli-utils';

describe('CLI Test', () => {

    beforeAll(() => {
        TestCliUtils.prepareIntegrationTest();
    });

    afterAll(async () => {
        await TestCliUtils.cleanTestStore();
    });

    describe('Help Command Test', () => {
        describe('When running avocat with help option', () => {
            it('Shows available options and commands', () => {
                return TestCliUtils.transpileAndRunAvocatFromCLI(['--help']).then(result => {
                    expect(result.code).toBe(0);
                    expect(result.stdout.trim()).toMatchSnapshot();
                }).catch(console.error);
            });
        });
    });

    describe('Status Command Test', () => {
        describe('When running avocat with status command and there is no pending changes', () => {
            it('Shows the message no pending changes', () => {
                return TestCliUtils.transpileAndRunAvocatFromCLI(['status']).then(result => {
                    expect(result.code).toBe(0);
                    expect(result.stdout.trim()).toMatchSnapshot();
                }).catch(console.error);
            });
        });
    });

    describe('Import Command Test', () => {
        describe('When running avocat with import command and a valid contract path', () => {
            it('Shows the message that a contract(name, version) was imported', () => {
                return TestCliUtils.transpileAndRunAvocatFromCLI(['import', './src/test/contracts-samples/test_sample_contract.yaml']).then(result => {
                    expect(result.code).toBe(0);
                    expect(result.stdout.trim()).toMatchSnapshot();
                }).catch(console.error);
            });
        });

        describe('When running avocat with status command after a contract was imported', () => {
            it('Shows the message that a contract is pending', () => {
                return TestCliUtils.transpileAndRunAvocatFromCLI(['status']).then(result => {
                    expect(result.code).toBe(0);
                    expect(result.stdout.trim()).toMatchSnapshot();
                }).catch(console.error);
            });
        });
    });

    describe('Environment Command Test', () => {
        describe('When adding a new environment with valid values', () => {
            it('should show a message that an environment was added', () => {
                return TestCliUtils.transpileAndRunAvocatFromCLI(['env:add', '-n env1', '-u https://www.example.com/', '-t TOKEN']).then(result => {
                    expect(result.code).toBe(0);
                    expect(result.stdout.trim()).toMatchSnapshot();
                }).catch(console.error);
            });
        });

        describe('When asking for the existing environments list', () => {
            it('should show a list with of the existing environments', () => {
                return TestCliUtils.transpileAndRunAvocatFromCLI(['env:list']).then(result => {
                    expect(result.code).toBe(0);
                    expect(result.stdout.trim()).toMatchSnapshot();
                }).catch(console.error);
            });
        });
    });
});

