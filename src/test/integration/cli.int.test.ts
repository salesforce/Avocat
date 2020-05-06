import {TestCliUtils} from '../utils/test-cli-utils';

describe('CLI Test', () => {
    describe('Help Command Test', () => {
        describe('When running avocat with help option', () => {
            it('Shows available options and commands', () => {
                jest.setTimeout(30000);
                return TestCliUtils.transpileAndRunAvocatFromCLI(['--help']).then(result => {
                    expect(result.code).toBe(0);
                    expect(result.stdout.trim()).toMatchSnapshot();
                }).catch(console.error);
            });
        });
    });
});

