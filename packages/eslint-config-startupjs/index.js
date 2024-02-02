module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@startupjs/react-pug/all'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: [
    'react',
    '@startupjs/react-pug',
    'import-helpers'
  ],
  rules: {
    'prefer-const': 'error',
    'eol-last': 'error',
    'react/jsx-handler-names': 'off',
    'react/prop-types': 'off',
    '@startupjs/react-pug/empty-lines': 'off',
    '@startupjs/react-pug/no-interpolation': 'off',
    '@startupjs/react-pug/prop-types': 'off',
    '@startupjs/react-pug/quotes': 'off',
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'ignore',
        groups: [
          '/^react$/',
          '/react-native/',
          '/^react.*/',
          '/^startupjs/',
          '/^@?startupjs.*/',
          '/^@?dmapper.*/',
          'module',
          '/^components/',
          ['/^helpers/', '/^hooks/'],
          ['sibling', 'parent'],
          '/.\\/index.styl/'
        ]
      }
    ]
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'standard-with-typescript'
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off'
      }
    }
  ]
}
