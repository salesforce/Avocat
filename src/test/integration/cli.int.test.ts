import {TestCliUtils} from '../utils/test-cli-utils';

describe('CLI Test', () => {

    beforeAll(() => {
        const INTEGRATION_TEST_TIMEOUT = 30000;
        jest.setTimeout(INTEGRATION_TEST_TIMEOUT);
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
});

