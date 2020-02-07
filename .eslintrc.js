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
    'react-pug',
    'exports-order'
  ],
  rules: {
    'prefer-const': 'off',
    'react/jsx-handler-names': 'off',
    'react/prop-types': 'off',
    'react-pug/empty-lines': 'off',
    'react-pug/no-interpolation': 'off',
    'react-pug/prop-types': 'off',
    'react-pug/quotes': 'off',
    'exports-order/need-order-export-line': 'error',
    'exports-order/need-order-export-module': 'error'
  },
  "overrides": [
    {
      "excludedFiles": [
        "./packages/ui/index.js",
        "./styleguide/main/pages/index.js",
        "./styleguide/components/index.js"
      ],
      "files": ["*.js"],
      "rules": {
          "exports-order/need-order-export-line": "off",
          "exports-order/need-order-export-module": "off"
        }
    }
   ]
}
