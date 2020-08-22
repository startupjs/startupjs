const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index.cjs')
const packageJson = require('../package.json')

const { name: pluginName } = packageJson

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    extensions: ['styl', 'css']
  },
  babelOptions: {
    plugins: ['@babel/plugin-syntax-jsx']
  },
  tests: {
    'Regular string': /* js */`
      import './index.styl'
      function Test () {
        return (
          <div styleName='root active'>
            <span styleName='title'>Title</span>
            <span styleName='description'>Description</span>
            <button styleName='submit disabled'>Submit</button>
          </div>
        )
      }
    `,
    'Regular string with existing style': /* js */`
      import './index.styl'
      function Test ({ style }) {
        const titleStyle = { color: 'red', fontWeight: 'bold' }
        return (
          <div style={[style, { backgroundColor: 'black' }]} styleName='root active'>
            <span styleName='title' style={titleStyle}>Title</span>
            <span styleName='description' style={{ color: 'green' }}>Description</span>
            <button styleName='submit disabled'>Submit</button>
          </div>
        )
      }
    `,
    'Arrays and objects': /* js */`
      import './index.styl'
      function Test ({ style, active, submit, disabled }) {
        const titleStyle = { color: 'red', fontWeight: 'bold' }
        return (
          <div style={style} styleName={['root', {active}]}>
            <span styleName={['title']} style={titleStyle}>Title</span>
            <span styleName={['description']} style={{ color: 'green' }}>Description</span>
            <button style={{ color: 'pink' }} styleName={{submit, disabled}}>Submit</button>
          </div>
        )
      }
    `,
    'Puts compiled attribute to the end of attributes list': /* js */`
      import './index.styl'
      function Test ({ style, active, submit, disabled }) {
        return (
          <div style={style} styleName={['root', {active}]} title='container'>
            <span styleName='text' style={{ color: 'red' }} center title='text' />
          </div>
        )
      }
    `,
    'With ::part() styles': /* js */`
      import './index.styl'
      function Test ({ style, active, submit, disabled, titleStyle }) {
        return (
          <Card style={style} styleName={['root', {active}]} titleStyle={[titleStyle, { color: 'green' }]} title='container'>
            <Content styleName='text' style={{ color: 'red' }} footerStyle={{ color: 'blue' }} center title='text' />
          </Card>
        )
      }
    `,
    'DEPRECATED! With ::part() styles and deprecated *StyleName props': /* js */`
      import './index.styl'
      function Test ({ style, active, submit, disabled, titleStyle }) {
        return (
          <Card style={style} styleName={['root', {active}]} titleStyleName={['title', {active}]} titleStyle={[titleStyle, { color: 'green' }]} title='container'>
            <Content styleName='text' style={{ color: 'red' }} footerStyleName='footer' footerStyle={{ color: 'blue' }} center title='text' />
          </Card>
        )
      }
    `
  }
})
