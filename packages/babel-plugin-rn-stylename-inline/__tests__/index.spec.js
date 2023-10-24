const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {},
  babelOptions: {
    plugins: ['@babel/plugin-syntax-jsx']
  },
  tests: {
    'Should throw an error if import is not specified': {
      error: true,
      code: `
        import React from 'react'

        styl\`
          .card
            color red
        \`
      `
    },
    'Should remove css and styl from startupjs import': /* js */`
      import React from 'react'
      import { css, observer, styl } from 'startupjs'
    `,
    'Should remove the whole lib if no other things are left in startupjs': /* js */`
      import React from 'react'
      import { css, styl } from 'startupjs'
    `,
    'Global css. Simple': /* js */`
      import React from 'react'
      import { css, observer } from 'startupjs'

      export default observer(function Card () {
        return <View styleName='card' />
      })

      css\`
        .card {
          color: red;
          background-color: green;
        }
      \`
    `,
    'Global styl. Simple': /* js */`
      import React from 'react'
      import { styl, observer } from 'startupjs'

      export default observer(function Card () {
        return <View styleName='card' />
      })

      styl\`
        .card
          color red
          background-color green
      \`
    `,
    'Global css. Several components': /* js */`
      import React from 'react'
      import { css } from 'startupjs'
      import { View } from 'react-native'

      export default function Card () {
        return <View styleName='card active'><Line /></View>
      }

      function Line () {
        return <View styleName='line' />
      }

      css\`
        .card {
          padding: 8px 16px;
        }
        .line {
          margin-top: 16px;
          border-radius: 8px;
        }
        .active {
          background-color: red;
        }
      \`
    `,
    'Global styl. Several components': /* js */`
      import React from 'react'
      import { styl } from 'startupjs'
      import { View } from 'react-native'

      export default function Card () {
        return <View styleName='card active'><Line /></View>
      }

      function Line () {
        return <View styleName='line' />
      }

      styl\`
        .card
          padding 8px 16px
        .line
          margin-top 16px
          border-radius 8px
        .active
          background-color red
      \`
    `,
    'Global and local css. Several components': /* js */`
      import React from 'react'
      import { css } from 'startupjs'
      import { View } from 'react-native'

      export default function Card () {
        return <View styleName='root active'><Line /></View>

        css\`
          .root {
            padding: 8px 16px;
          }
        \`
      }

      function Line () {
        return <View styleName='root' />

        css\`
          .root {
            margin-top: 16px;
            border-radius: 8px;
          }
        \`
      }

      css\`
        .active {
          background-color: red;
        }
      \`
    `,
    'Global and local css and styl. Several components': /* js */`
      import React from 'react'
      import { css, styl } from 'startupjs'
      import { View } from 'react-native'

      export default function Card () {
        return <View styleName='root active'><Line /></View>

        styl\`
          .root
            padding 8px 16px
        \`
      }

      function Line () {
        return <View styleName='root' />

        css\`
          .root {
            margin-top: 16px;
            border-radius: 8px;
          }
        \`
      }

      styl\`
        .active
          background-color red
      \`
    `,
    'Aliasing css and styl': /* js */`
      import React from 'react'
      import { css as myCss, styl as myStyl, observer } from 'startupjs'

      export default observer(function Card () {
        myStyl\`
          .card
            color blue
        \`
        return <View styleName='card' />
      })

      myCss\`
        .card {
          color: red;
          background-color: green;
        }
      \`
    `
  }
})
