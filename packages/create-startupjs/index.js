#!/usr/bin/env node
'use strict'

import url from 'url'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { Command } from 'commander'
import * as install from './install/index.js'

const __filename = url.fileURLToPath(import.meta.url)
const packageJson = JSON.parse(readFileSync(join(dirname(__filename), 'package.json')))

const program = new Command()
  .usage('[options]')
  .description(install.description)
  .version(packageJson.version, '-v, --version', 'version of create-startupjs utility')

for (const option of install.options) program.option(option.name, option.description)

program.action(install.action)

program.parse(process.argv)
