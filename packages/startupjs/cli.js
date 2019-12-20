#!/usr/bin/env node
'use strict'

var cli = require('@startupjs/cli')
var path = require('path')
var templatesPath = path.join(__dirname, 'templates')

if (require.main === module) {
  cli.run({ templatesPath: templatesPath })
}

module.exports = cli
