// This is the same preset as metro's, but everything which is supported
// by Node 14+ and latest Chrome is stripped out.

module.exports = ({ debugJsx }) => {
  const defaultPlugins = [
    [require('@babel/plugin-syntax-flow')],
    [require('@babel/plugin-proposal-nullish-coalescing-operator')],
    [require('@babel/plugin-proposal-optional-chaining'), { loose: true }],
    [require('@babel/plugin-proposal-class-properties'), { loose: true }],
    [require('@babel/plugin-transform-function-name')]
  ]
  const extraPlugins = [
    [require('@babel/plugin-transform-react-jsx')],
    ...(debugJsx ? [
      require('@babel/plugin-transform-react-jsx-source'),
      require('@babel/plugin-transform-react-jsx-self')
    ] : []),
    [
      require('@babel/plugin-transform-runtime'),
      {
        helpers: true,
        regenerator: true
      }
    ]
  ]
  return {
    comments: false,
    compact: true,
    overrides: [
      // the flow strip types plugin must go BEFORE class properties!
      // there'll be a test case that fails if you don't.
      {
        plugins: [require('@babel/plugin-transform-flow-strip-types')]
      },
      {
        plugins: defaultPlugins
      },
      {
        test: isTypeScriptSource,
        plugins: [
          [
            require('@babel/plugin-transform-typescript'),
            {
              isTSX: false,
              allowNamespaces: true,
              onlyRemoveTypeImports: true
            }
          ]
        ]
      },
      {
        test: isTSXSource,
        plugins: [
          [
            require('@babel/plugin-transform-typescript'),
            {
              isTSX: true,
              allowNamespaces: true,
              onlyRemoveTypeImports: true
            }
          ]
        ]
      },
      {
        plugins: extraPlugins
      }
    ]
  }
}

function isTypeScriptSource (fileName) {
  return !!fileName && fileName.endsWith('.ts')
}

function isTSXSource (fileName) {
  return !!fileName && fileName.endsWith('.tsx')
}
