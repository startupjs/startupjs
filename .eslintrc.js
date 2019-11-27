module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true
  },
  extends: [
    'standard',
    'standard-react',
    'plugin:react-pug/all'
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
  plugins: [
    'react',
    'react-pug'
  ],
  rules: {
    'prefer-const': 'off',
    'react/jsx-handler-names': 'off',
    'react/prop-types': 'off',
    'react-pug/empty-lines': 'off',
    'react-pug/no-interpolation': 'off',
    'react-pug/prop-types': 'off',
    'react-pug/quotes': 'off'
  }
}
