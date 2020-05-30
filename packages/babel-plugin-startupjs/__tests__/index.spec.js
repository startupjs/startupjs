const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {},
  tests: {
    'Ignores imports of other libs': /* js */`
      import { observer } from 'startupjs'
      import App from 'startupjs/app'
    `,
    'Transforms known import from moduleMap.json': /* js */`
      import { Button } from '@startupjs/ui'
    `,
    'Transforms multiple imports': /* js */`
      import { Button, Span, TextInput, Collapse } from '@startupjs/ui'
    `,
    'Doesn\'t touch unknown imports': /* js */`
      import { Button, UnknownComponent } from '@startupjs/ui'
    `,
    'Doesn\'t touch grep imports': /* js */`
      import * as UI from '@startupjs/ui'
    `,
    'Transforms export': /* js */`
      export { observer } from 'startupjs'
      export { Button, UnknownComponent, Span, TextInput } from '@startupjs/ui'
    `
  }
})
