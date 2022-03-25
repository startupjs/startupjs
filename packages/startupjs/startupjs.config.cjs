module.exports = {
  type: 'plugin',
  bundler: {
    forceCompile: {
      web: [
        'startupjs/app',
        'startupjs/i18n',
        'startupjs/init',
        'startupjs/plugin',
        'startupjs/baseUrl'
      ],
      server: [
        'startupjs/app',
        'startupjs/i18n',
        'startupjs/init',
        'startupjs/nconf',
        'startupjs/orm',
        'startupjs/server'
      ]
    }
  }
}
