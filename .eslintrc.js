module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
      jsx: true
    },
    ecmaVersion: 10,
    sourceType: 'module'
  },
  rules: {
    'prefer-const': 'off'
  }
}
