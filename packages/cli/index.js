import { Command } from 'commander'
import commands from './commands/index.js'

const program = new Command()
  .usage('<command> [options]')

async function run () {
  for (const command of commands) {
    const { name, description, options = [], fn } = command

    if (program.commands.find(cmd => cmd.name() === name)) {
      throw new Error(
        `Attempted to override an already registered command: ${name}`
      )
    }

    const cmd = program
      .command(name)
      .action(fn)

    if (description) cmd.description(description)

    for (const option of options) {
      const { name, descirption } = option
      cmd.option(name, descirption)
    }
  }

  program.parse(process.argv)
}

export { run }
