module.exports = (api, { platform, env } = {}) => {
  return {
    overrides: [{
      test: isJsxSource,
      plugins: [
        // support JSX syntax
        require('@babel/plugin-syntax-jsx')
      ]
    }, {
      test: isTypeScriptSource,
      plugins: [
        // support TypeScript syntax
        require('@babel/plugin-syntax-typescript')
      ]
    }, {
      test: isTsxSource,
      plugins: [
        // support TypeScript + JSX syntax
        [require('@babel/plugin-syntax-typescript'), {
          isTSX: true
        }]
      ]
    }, {
      plugins: [
        // transform pug to jsx. This generates a bunch of new AST nodes
        // (it's important to do this first before any dead code elimination runs)
        [require('@startupjs/babel-plugin-transform-react-pug'), {
          classAttribute: 'styleName'
        }],
        // support calling sub-components in pug (like <Modal.Header />)
        [require('@startupjs/babel-plugin-react-pug-classnames'), {
          classAttribute: 'styleName'
        }],
        // turning on experimental startupjs features
        [require('@startupjs/babel-plugin-startupjs-utils'), {
          observerCache: true,
          signals: true
        }],
        // debugging features
        env === 'development' && require('@startupjs/babel-plugin-startupjs-debug'),
        // .env files support for client
        [require('@startupjs/babel-plugin-dotenv'), (() => {
          const envName = env === 'production' ? 'production' : 'local'
          const options = {
            moduleName: '@env',
            path: ['.env', `.env.${envName}`]
          }
          if (platform === 'web') {
            options.override = {
              BASE_URL: "typeof window !== 'undefined' && window.location && window.location.origin"
            }
          }
          return options
        })()],
        // CSS modules (separate .styl/.css file)
        [require('@startupjs/babel-plugin-rn-stylename-to-style'), {
          extensions: ['styl', 'css'],
          useImport: true
        }],
        // inline CSS modules (styl`` in the same JSX file -- similar to how it is in Vue.js)
        [require('@startupjs/babel-plugin-rn-stylename-inline'), {
          platform
        }],
        require('@startupjs/babel-plugin-i18n-extract')
      ].filter(Boolean)
    }]
  }
}

// all files which are not .ts or .tsx are considered to be pure JS with JSX support
function isJsxSource (fileName) {
  if (!fileName) return false
  return !isTypeScriptSource(fileName) && !isTsxSource(fileName)
}

function isTypeScriptSource (fileName) {
  if (!fileName) return false
  return fileName.endsWith('.ts')
}

// NOTE: .tsx is the default when fileName is not provided.
//       This is because we want to support the most overarching syntax by default.
function isTsxSource (fileName) {
  if (!fileName) return true
  return fileName.endsWith('.tsx')
}
