module.exports = {
  type: 'plugin',
  bundler: {
    forceCompile: {
      web: [
        'startupjs/app',
        'startupjs/init',
        'startupjs/plugin'
      ],
      server: [
        'startupjs/app',
        'startupjs/init',
        'startupjs/orm',
        'startupjs/server'
      ]
    }
  }
}
