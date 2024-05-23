const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    classAttribute: 'styleName'
  },
  babelOptions: {
    plugins: ['@babel/plugin-syntax-jsx']
  },
  tests: {
    "Doesn't transform regular jsx without styleName": /* js */`
      <View style={{ backgroundColor: 'red' }}>
        <Text style={{ color: 'blue' }}>Hello World</Text>
      </View>
    `,
    "Doesn't transform styleName w/o capital letter classes": /* js */`
      <View styleName='card article' style={{ backgroundColor: 'red' }}>
        <Text styleName='content' style={{ color: 'blue' }}>Hello World</Text>
      </View>
    `,
    'Transforms styleName which has a capital class': /* js */`
      <View styleName='Card article' style={{ backgroundColor: 'red' }}>
        <Text styleName='content' style={{ color: 'blue' }}>Hello World</Text>
      </View>
    `,
    'Transforms styleName which has a binary expression': /* js */`
      <View styleName={'Card ' + { article }} style={{ backgroundColor: 'red' }}>
        <Text styleName='content' style={{ color: 'blue' }}>Hello World</Text>
      </View>
    `,
    'Transforms styleName which has a binary expression with multiple static classes': /* js */`
      <View styleName={'Card primary ' + [{ article }, importance]} style={{ backgroundColor: 'red' }}>
        <Text styleName='content' style={{ color: 'blue' }}>Hello World</Text>
      </View>
    `,
    'Transforms binary expressions even when there are no capital classes': /* js */`
      <View styleName={'card primary' + { article }} style={{ backgroundColor: 'red' }}>
        <Text styleName='content' style={{ color: 'blue' }}>Hello World</Text>
      </View>
    `,
    "Doesn't transform array when no capital classes are present": /* js */`
      <View styleName={['card', 'primary']} style={{ backgroundColor: 'red' }}>
        <Text styleName={['content']} style={{ color: 'blue' }}>Hello World</Text>
      </View>
    `,
    'Transform array when capital classes are present': /* js */`
      <View styleName={['Card', 'primary']} style={{ backgroundColor: 'red' }}>
        <Text styleName={['Content']} style={{ color: 'blue' }}>Hello World</Text>
      </View>
    `
  }
})
