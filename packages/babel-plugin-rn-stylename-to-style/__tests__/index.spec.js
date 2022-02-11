const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index.cjs')
const packageJson = require('../package.json')

const { name: pluginName } = packageJson

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    extensions: ['styl', 'css'],
    useImport: true
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
    `,
    'part attribute. No props': /* js */`
      import './index.styl'
      function Test () {
        return (
          <Card
            part='card'
            style={{ color: 'blue' }}
            titleStyle={{ color: 'red' }}
          >
            <Content
              styleName='content'
              part='content active'
              style={{ fontWeight: 'bold' }}
              bodyStyle={{ color: 'blue' }}
            />
          </Card>
        )
      }
    `,
    'part attribute. With destructed props': /* js */`
      import './index.styl'
      function Test ({ style, cardStyle, title, ...props }) {
        return (
          <Card
            part='card'
            style={{ color: 'blue' }}
            titleStyle={{ color: 'red' }}
          >
            <Content part='content active' />
          </Card>
        )
      }
    `,
    'part attribute. With named props': /* js */`
      import './index.styl'
      function Test (props) {
        return (
          <Card
            part='card'
            style={{ color: 'blue' }}
            titleStyle={{ color: 'red' }}
          >
            <Content part='content active' />
          </Card>
        )
      }
    `,
    'part attribute. With anon function within named fn': /* js */`
      import './index.styl'
      const Test = ({ style, cardStyle: myCardStyle, contentStyle, title, ...props }) => {
        function render () {
          return (
            <Card
              part='card'
              style={{ color: 'blue' }}
              titleStyle={{ color: 'red' }}
            >
              <Content part='content active' />
            </Card>
          )
        }
        return render()
      }
    `,
    'magic \'root\' part': /* js */`
      import './index.styl'
      function Test ({ title, ...props }) {
        return (
          <Card
            part='root'
            style={{ color: 'blue' }}
            titleStyle={{ color: 'red' }}
          >
            <Content part='content active' />
          </Card>
        )
      }
    `,
    'magic \'root\' part with existing style prop': /* js */`
      import './index.styl'
      function Test ({ title, style, ...props }) {
        return (
          <Card
            part='root'
            style={{ color: 'blue' }}
            titleStyle={{ color: 'red' }}
          >
            <Content part='content active' />
          </Card>
        )
      }
    `,
    'dynamic part attribute. Object': /* js */`
      import './index.styl'
      const Test = ({ style, cardStyle: myCardStyle, contentStyle, title, ...props }) => {
        function render () {
          return (
            <Card
              part='card'
              style={{ color: 'blue' }}
              titleStyle={{ color: 'red' }}
            >
              <Content part={{content: true, active}} />
            </Card>
          )
        }
        return render()
      }
    `,
    'dynamic part attribute. Array and Object': /* js */`
      import './index.styl'
      const Test = ({ style, cardStyle: myCardStyle, contentStyle, title, ...props }) => {
        function render () {
          return (
            <Card
              part='card'
              style={{ color: 'blue' }}
              titleStyle={{ color: 'red' }}
            >
              <Content part={['content', { active }]} />
            </Card>
          )
        }
        return render()
      }
    `,
    'dynamic part attribute. Should error on unsupported dynamic value': {
      code: /* js */`
        import './index.styl'
        function Test ({ variant }) {
          return (
            <Card part={variant} />
          )
        }
      `,
      error: /'part' attribute might only be the following/
    },
    'dynamic part attribute. Should error on unsupported dynamic value in array': {
      code: /* js */`
        import './index.styl'
        function Test ({ variant }) {
          return (
            <Card part={['card', variant]} />
          )
        }
      `,
      error: /'part' attribute only supports static strings or objects inside an array/
    },
    'dynamic part attribute. Should error on unsupported dynamic key in object': {
      code: /* js */`
        import './index.styl'
        function Test ({ variant }) {
          return (
            <Card part={{[variant]: true}} />
          )
        }
      `,
      error: /'part' attribute only supports literal or string keys in object/
    }
  }
})

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    extensions: ['styl', 'css'],
    useImport: false
  },
  babelOptions: {
    plugins: ['@babel/plugin-syntax-jsx']
  },
  tests: {
    'DEPRECATED! Legacy CJS version when "useImport: false".': /* js */`
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
    `
  }
})

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    extensions: ['styl', 'css'],
    useImport: true,
    parseJson: true
  },
  babelOptions: {
    plugins: ['@babel/plugin-syntax-jsx']
  },
  tests: {
    '"parseJson" option. Used when we receive compiled css as a json string': /* js */`
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
    '"parseJson" option with default import': /* js */`
      import STYLES from './index.styl'
      console.log(STYLES)
      function Test () {
        return (
          <div styleName='root active'>
            <span styleName='title'>Title</span>
          </div>
        )
      }
    `
  }
})
