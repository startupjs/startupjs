module.exports = {
  type: 'plugin',
  bundler: {
    forceCompile: {
      web: [
        'startupjs/app',
        'startupjs/baseUrl',
        'startupjs/i18n',
        'startupjs/init',
        'startupjs/plugin'
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
