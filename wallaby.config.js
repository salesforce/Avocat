// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = () => {
    return {
        files: [
            'src/**/*',
            {pattern: 'src/**/*.test.ts', ignore: true, instrument: false}
        ],

        tests: [
            'src/main/**/*.unit.test.ts'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'jest'
    };
};