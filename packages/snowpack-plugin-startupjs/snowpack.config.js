module.exports = {
  mount: {
    main: '/main',
    Root: '/Root',
    // public: '/',
    '.': '/',
    model: '/model',
    components: '/components'
  },
  plugins: [
    './plugins/babel',
    './plugins/stylusToReactNative',
    './plugins/cssToReactNative'
    // '@snowpack/plugin-react-refresh'
  ],
  alias: {
    'react-native': 'react-native-web/dist/cjs/index.js',
    components: './components',
    racer: '@startupjs/racer'
  },
  devOptions: {
    port: 3010
  },
  packageOptions: {
    external: ['@env', '@startupjs/server'],
    knownEntrypoints: [
      '@babel/runtime/helpers/extends',
      '@startupjs/babel-plugin-rn-stylename-to-style/process',
      'react-native-web/dist/cjs/index.js',
      'startupjs/orm'
    ]
  },
  exclude: [
    './server',
    './android',
    './ios'
  ]
}
