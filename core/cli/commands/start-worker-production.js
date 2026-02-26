import { $ } from 'execa'

export const name = 'start-worker-production'
export const description = 'Start worker node server with NODE_ENV=production'
export const options = [{
  name: '-i, --inspect',
  description: 'Enable NodeJS inspector agent'
}]

export async function action ({ inspect } = {}) {
  await $({
    stdio: 'inherit',
    env: { NODE_ENV: 'production' }
  })`\
    node \
      --experimental-detect-module \
      ${inspect ? '--inspect' : []} \
      --import=startupjs/nodeRegister \
      -e import('startupjs/startWorker') \
  `
}
