export default {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/databases/**', '!src/schemas/**', '!src/tests/**', '!src/errors/**'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
