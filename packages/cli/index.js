import { Command } from 'commander'
import * as commands from './commands/index.js'

const program = new Command()
  .usage('<command> [options]')

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
