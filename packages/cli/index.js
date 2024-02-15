import { Command } from 'commander'
import url from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import * as commands from './commands/index.js'

const __filename = url.fileURLToPath(import.meta.url)
const packageJson = JSON.parse(readFileSync(join(dirname(__filename), 'package.json')))

const program = new Command()
  .usage('<command> [options]')
  .version(packageJson.version, '-v, --version', 'output the version of startupjs cli utility in this project')

async function run () {
  for (const command of Object.values(commands)) {
    const { name, description, options = [], action } = command

    if (program.commands.find(cmd => cmd.name() === name)) {
      throw new Error(`Attempted to override an already registered command: ${name}`)
    }

    const cmd = program.command(name)
    if (description) cmd.description(description)

    for (const option of options) {
      const { name, description } = option
      cmd.option(name, description)
    }

    cmd.action(action)
  }

  program.parse(process.argv)
}

export { run }
