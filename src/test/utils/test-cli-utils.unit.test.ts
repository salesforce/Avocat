import {TestCliUtils} from './test-cli-utils';
import {Command} from 'commander';

describe('Test CLI Utils', () => {

    beforeAll(() => {
        TestCliUtils.prepareIntegrationTest();
    });

    describe('When the command is executed successfully', () => {
        it('Should return stdout with code 0', async () => {
            const result = await TestCliUtils.transpileAndRunAvocatFromCLI(['-v']);

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

    describe('When runCommand function is called with (mainCommand and command)', () => {
        it('Should call mainCommand.parse with the provided parameters',() => {
            const mainCommand: Command = jest.genMockFromModule('commander');
            mainCommand.parse = jest.fn();

            TestCliUtils.runCommandFromCommander(mainCommand, 'ls');

            expect(mainCommand.parse).toHaveBeenCalledTimes(1);
        });
    });
});