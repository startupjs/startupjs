#!/usr/bin/env node
'use strict'

var cli = require('@startupjs/cli')
var path = require('path')
var templatePath = path.join(__dirname, 'template')

if (require.main === module) {
  cli.run({ templatePath: templatePath })
}

module.exports = cli