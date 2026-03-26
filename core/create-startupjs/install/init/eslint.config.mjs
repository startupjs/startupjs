import { defineConfig } from 'eslint/config'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import cssxjs from 'eslint-plugin-cssxjs'

export default defineConfig([
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
    ts: true
  }),
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
