#!/usr/bin/env node
'use strict'

import cli from '@startupjs/cli'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const templatesPath = path.join(__dirname, 'templates')

cli.run({ templatesPath })
