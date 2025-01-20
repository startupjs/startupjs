import { $ } from 'execa'

export const name = 'start-worker'
export const description = 'Start worker node server'

export async function action () {
  await $({ stdio: 'inherit' })`\
    node \
      --experimental-detect-module \
      --import=startupjs/nodeRegister \
      -e import('startupjs/startWorker') \
  `
}
