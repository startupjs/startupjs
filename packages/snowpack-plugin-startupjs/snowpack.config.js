module.exports = {
  mount: {
    main: '/main',
    Root: '/Root',
    public: '/',
    model: '/model',
    components: '/components'
  },
  plugins: [
    './plugins/babel',
    './plugins/stylusToReactNative',
    './plugins/cssToReactNative',
    '@snowpack/plugin-react-refresh'
  ],
  install: [
    '@babel/runtime/helpers/extends',
    '@startupjs/babel-plugin-rn-stylename-to-style/process',
    'react-native-web/dist/cjs/index.js',
    'startupjs/orm'
  ],
  alias: {
    'react-native': 'react-native-web/dist/cjs/index.js',
    components: './components',
    racer: '@startupjs/racer'
  },
  devOptions: {
    port: 3010
  },
  installOptions: {
    externalPackage: ['@env', '@startupjs/server']
  },
  exclude: [
    './server',
    './android',
    './ios'
  ]
}
