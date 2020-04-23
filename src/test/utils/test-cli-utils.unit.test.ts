import {TestCliUtils} from './test-cli-utils';

describe('Test CLI Utils', () => {
    describe('When the command is executed successfully', () => {
        it('Should return stdout with code 0', async () => {
            const result = await TestCliUtils.transpileAndRunAvocatFromCLI(['node']);
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
});