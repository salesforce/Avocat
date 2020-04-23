import {TestCliUtils} from '../utils/test-cli-utils';

describe('CLI Test', () => {
    describe('Help Command Test', () => {
        describe('When running avocat with no arguments', () => {
            it('Shows available options and commands', async () => {
                const result = await TestCliUtils.transpileAndRunAvocatFromCLI([]);
                expect(result.code).toBe(0);
                expect(result.stdout.trim()).toMatchSnapshot();
            });
        });

        describe('When running avocat with short help option', () => {
            it('Shows available options and commands', async () => {
                const result = await TestCliUtils.transpileAndRunAvocatFromCLI(['-h']);
                expect(result.code).toBe(0);
                expect(result.stdout.trim()).toMatchSnapshot();
            });
        });

        describe('When running avocat with long help option', () => {
            it('Shows available options and commands', async () => {
                const result = await TestCliUtils.transpileAndRunAvocatFromCLI(['--help']);
                expect(result.code).toBe(0);
                expect(result.stdout.trim()).toMatchSnapshot();
            });
        });
    });

    describe('Status Command Test', () => {
        describe('When running avocat status', () => {
            it('Shows status message', async () => {
                const result = await TestCliUtils.transpileAndRunAvocatFromCLI(['status']);
                expect(result.code).toBe(0);
                expect(result.stdout.trim()).toMatchSnapshot();
            });
        });
    });

});

