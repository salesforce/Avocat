/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {TestCliUtils} from './test-cli-utils';
import {Command} from 'commander';

describe('Test CLI Utils', () => {

    beforeAll(() => {
        TestCliUtils.prepareIntegrationTest();
    });

    describe('When the command is executed successfully', () => {
        it('Should return stdout with code 0', async () => {
            const result = await TestCliUtils.transpileAndRunAvocatFromCLI(['-V']);

            expect(result).not.toBeUndefined();
            expect(result.code).toBe(0);
        });
    });

    describe('When dist/index could not be found', () => {
        it('Should return code should not be 0', async () => {
            const result = await TestCliUtils.transpileAndRunAvocatFromCLI([], '../dummy');

            expect(result.code).not.toBe(0);
        });
    });

    describe('When runCommandFromCommander function is called with (mainCommand and command)', () => {
        it('Should call mainCommand.parseAsync with the provided parameters', () => {
            const mainCommand: Command = jest.genMockFromModule('commander');
            mainCommand.parseAsync = jest.fn().mockResolvedValueOnce('');

            return TestCliUtils.runCommandFromCommander(mainCommand, 'ls')
                .then(() => expect(mainCommand.parseAsync).toHaveBeenCalledTimes(1));
        });
    });
});