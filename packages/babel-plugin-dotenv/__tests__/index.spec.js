const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    path: ['__tests__/.env']
  },
  tests: {
    'Transforms imports to constants, and places them after all other imports': /* js */`
      import { observer } from 'startupjs'
      import { BASE_URL, STRIPE_PUBLIC_KEY } from '@env'
      import React from 'react'
      import { Text } from 'react-native'
      const foo = 'Bar' + BASE_URL
    `,
    'Transforms when @env is a sole import': /* js */`
      import { BASE_URL, STRIPE_PUBLIC_KEY } from '@env'
      const foo = 'Bar' + BASE_URL
    `,
    'Override value with mock': {
      pluginOptions: {
        path: ['__tests__/.env'],
        override: {
          BASE_URL: "typeof window !== 'undefined' && window.location && window.location.origin"
        }
      },
      code: /* js */`
        import { BASE_URL as baseUrl } from '@env'
        const foo = 'Bar' + baseUrl
      `
    },
    'When override is present, do it no matter if the env exists or not': {
      pluginOptions: {
        path: [],
        override: {
          BASE_URL: "typeof window !== 'undefined' && window.location && window.location.origin"
        }
      },
      code: /* js */`
        import { BASE_URL as baseUrl } from '@env'
        const foo = 'Bar' + baseUrl
      `
    },
    'Overrides value when multiple envs specified': {
      pluginOptions: {
        path: ['__tests__/.env', '__tests__/.env.production']
      },
      code: /* js */`
        import { BASE_URL, STRIPE_PUBLIC_KEY } from '@env'
        const foo = 'Bar' + BASE_URL
      `
    },
    'Throws an error if the var is not present': {
      code: /* js */`
        import { BASE_URL, NON_EXISTENT } from '@env'
        const foo = 'Bar' + BASE_URL
      `,
      error: true
    }
  }
})
