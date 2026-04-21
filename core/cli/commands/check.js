import { runCli } from '@react-pug/check-types'

export const name = 'check [files...]'
export const description = 'Type-check the current project with React-Pug support'
export const helpText = [
  'Examples:',
  '  npx startupjs check',
  '    Check the current working directory as a full TypeScript project.',
  '',
  '  npx startupjs check src/App.tsx src/Button.tsx',
  '    Check only the selected files while still using the full project context.',
  '',
  '  npx startupjs check --project packages/web src/App.tsx',
  '    Resolve tsconfig.json from a specific project path and then check selected files.'
].join('\n')

export const options = [
  {
    name: '-p, --project <path>',
    description: 'Path to tsconfig.json or a directory containing it'
  },
  {
    name: '--tagFunction <name>',
    description: 'Tagged template function name to recognize (default: pug)'
  },
  {
    name: '--injectCssxjsTypes <mode>',
    description: 'cssxjs/startupjs React prop injection mode: never, auto, or force'
  }
]

export async function action (files = [], options) {
  const args = [...files]
  if (options.project) args.push('--project', options.project)
  if (options.tagFunction) args.push('--tagFunction', options.tagFunction)
  if (options.injectCssxjsTypes) args.push('--injectCssxjsTypes', options.injectCssxjsTypes)

  const exitCode = await runCli(args)
  if (exitCode !== 0) process.exit(exitCode)
}
