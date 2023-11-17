module.exports = {
  type: 'plugin',
  bundler: {
    forceCompile: {
      web: [
        'startupjs/app',
        'startupjs/i18n',
        'startupjs/init',
        'startupjs/plugin'
      ]
    }
  }
}
