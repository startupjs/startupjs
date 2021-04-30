module.exports = {
  type: 'plugin',
  bundler: {
    forceCompile: {
      web: [
        'startupjs/app',
        'startupjs/i18n',
        'startupjs/init',
        'startupjs/plugin'
      ],
      server: [
        'startupjs/app',
        'startupjs/i18n',
        'startupjs/orm',
        'startupjs/server'
      ]
    }
  }
}
