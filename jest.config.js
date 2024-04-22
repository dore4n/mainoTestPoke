module.exports = {
    moduleFileExtensions: ['js', 'json', 'vue'],
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '^.+\\.js$': 'babel-jest'
    },
    testMatch: ['<rootDir>/test/**/*.spec.js'],
    testPathIgnorePatterns: ['/node_modules/'],
    testEnvironment: 'jsdom'
  };