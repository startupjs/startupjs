#!/usr/bin/env node
'use strict'

var cli = require('@startupjs/cli')

if (require.main === module) {
  cli.run()
}

module.exports = cli