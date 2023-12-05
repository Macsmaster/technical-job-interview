module.exports = {
  preset: `jest-preset-angular`,
  globalSetup: `jest-preset-angular/global-setup`,
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  coveragePathIgnorePatterns: [
    `<rootDir>/node_modules`,
    `<rootDir>/dist`,
    `<rootDir>/jest-global-mocks.ts`,
    `(.*).module.ts`,
    `(.*).tokens.ts`,
    `(.*).interface.ts`,
    `(.*).model.ts`,
    `(.*).gateway.ts`,
    `(.*).constants.ts`,
    `(.*).mock.ts`,
    `source.config.ts`,
  ],
  coverageDirectory: `<rootDir>/coverage`,
};
