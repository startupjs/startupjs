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
    'Failed test 2': /* js */`
      import { observer, useBackPress } from 'startupjs'

      function Menu ({ style, children, value, variant, activeBorder, iconPosition, activeColor, ...props }) {
        return (
          <Context.Provider value={value}>
            <Div style={style} />
            <Div
              style={style}
              styleName={['root', [variant]]}
              {...props}
            >{children}</Div>
          </Context.Provider>
        )
      }
    `,
    'Failed test 1': /* js */`
      import { observer, useBackPress } from 'startupjs'

      function Layout ({ style, children }) {
        return (
          <SafeAreaView styleName='root' style={style}>
            <StatusBar
              backgroundColor={bgColor}
              barStyle='dark-content'
            >
              {children}
            </StatusBar>
          </SafeAreaView>
        )
      }

      export default observer(Layout)
    `,
    'No styles file': /* js */`
      function Test () {
        return <div styleName='root' />
      }
    `,
    'Style without observer. Shouldn\'t transform': /* js */`
      import { useLocal } from 'startupjs'
      function Test () {
        return (
          <div style={{ backgroundColor: 'red' }}>
            <div style={{ color: 'green' }} titleStyle={{ color: 'blue' }} />
            <div>
              <span headerStyle={{ color: 'yellow' }}>Hello</span>
            </div>
          </div>
        )
      }
    `,
    'Style with observer. Should transform for caching': /* js */`
      import { observer } from 'startupjs'
      export default observer(function Test () {
        return (
          <div style={{ backgroundColor: 'red' }}>
            <div style={{ color: 'green' }} titleStyle={{ color: 'blue' }} />
            <div>
              <span headerStyle={{ color: 'yellow' }}>Hello</span>
            </div>
          </div>
        )
      })
    `,
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
    'dynamic part attribute. Array and Object. Multiple keys.': /* js */`
      import './index.styl'
      const Test = ({ style, layout, cardStyle: myCardStyle, contentStyle, title, ...props }) => {
        function render () {
          return (
            <Card
              part='card'
              style={{ color: 'blue' }}
              titleStyle={{ color: 'red' }}
            >
              <Content part={['content', { row: layout === 'row', column: layout === 'column' }]} />
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
    },
    'styl function to get style props manually instead of using styleName': /* js */`
      import './index.styl'
      import { styl } from 'startupjs'
      const Test = ({ style, active, variant, cardStyle: myCardStyle, contentStyle, title, ...props }) => {
        function render () {
          return (
            <Card
              {...styl(
                ['root', variant],
                {
                  style: [myCardStyle, { color: 'blue' }],
                  titleStyle: { color: 'red' }
                }
              )}
            >
              <Content {...styl(['content', variant, { active }])} />
            </Card>
          )
        }
        return render()
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

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    extensions: ['styl', 'css']
  },
  babelOptions: {
    plugins: [
      '@babel/plugin-syntax-jsx'
    ]
  },
  tests: {
    'Find proper react component. Simplest': /* js */`
      import './index.styl'
      export default function Test () {
        return <Div part='root' />
      }
    `,
    'Find proper react component. With const and anonymous': /* js */`
      import './index.styl'
      export const Test = function () {
        return <Div part='root' />
      }
    `,
    'Find proper react component. With const and arrow': /* js */`
      import './index.styl'
      export const Test = () => {
        return <Div part='root' />
      }
    `,
    'Find proper react component. With arrow and wrapped into named function': /* js */`
      import './index.styl'
      export const Test = () => {
        function renderItem () {
          return <Div part='item' />
        }
        return <Div part='root'>{renderItem()}</Div>
      }
    `,
    'Find proper react component. With arrow and wrapped into arrow function': /* js */`
      import './index.styl'
      export const Test = () => {
        const renderItem = () => {
          return <Div part='item' />
        }
        return <Div part='root'>{renderItem()}</Div>
      }
    `,
    'Find proper react component. First capital letter function must be returned': /* js */`
      import './index.styl'
      export default function ComponentFactory (title) {
        return function Component () {
          function renderItem () {
            return <Span part='item'>{title}</Span>
          }
          const renderFooter = () => <Div part='footer' />
          return <Div part='root'>{renderItem()}{renderFooter()}</Div>
        }
      }
    `
  }
})

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    extensions: ['styl', 'css']
  },
  babelOptions: {
    plugins: [
      ['@startupjs/babel-plugin-transform-react-pug', {
        classAttribute: 'styleName'
      }],
      '@babel/plugin-syntax-jsx'
    ]
  },
  tests: {
    '::part() in pug loop': /* js */`
      import './index.styl'
      function Test ({ items, ...props }) {
        return pug\`
          Card(
            part='root'
            style={ color: 'blue' }
          )
            each item in items
              Content(part='item')= item
        \`
      }
    `
  }
})
