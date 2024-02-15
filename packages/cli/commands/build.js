import { $ } from 'execa'

export const name = 'build'
export const description = 'Build web bundle for production usage'

export async function action ({ inspect }) {
  await $({ stdio: 'inherit' })`\
    npx expo export -p web \
  `
}
