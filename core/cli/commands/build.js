import { $ } from 'execa'

export const name = 'build'
export const description = 'Build web bundle for production usage'

export async function action ({ inspect }) {
  await $({
    stdio: 'inherit',
    env: { IS_BUILD: 'true' }
  })`\
    npx expo export -p web \
  `
}
