import { $ } from 'execa'

export default {
  name: 'server',
  description: 'Starts the application server on NodeJS',
  options: [
    {
      name: '-i, --inspect',
      description: 'Enable NodeJS inspector agent'
    }
  ],
  fn: server
}

function server ({ inspect }) {
  const options = [
    '--watch',
    '--experimental-detect-module'
  ]

  if (inspect) options.push('--inspect')

  $({ stdio: 'inherit' })`node ${options} server.js`
}
