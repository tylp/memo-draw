const config = {
    rootDir: 'src',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.test.ts'],
    testRegex: '(/__tests__/.*|(\\.|/)(test))\\.tsx?$',
};

module.exports = config;