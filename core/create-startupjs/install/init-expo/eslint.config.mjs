import { defineConfig } from 'eslint/config'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import expoConfig from 'eslint-config-expo/flat.js'
import cssxjs from 'eslint-plugin-cssxjs'

export default defineConfig([
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
  }),
  expoConfig,
  {
    plugins: {
      cssxjs
    },
    processor: 'cssxjs/react-pug'
  },
  {
    ignores: ['dist/*']
  }
])
