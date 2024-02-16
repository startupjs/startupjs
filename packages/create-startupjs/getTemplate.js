import path from 'path'
import url from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const CLI_VERSION = require('./package.json').version
const IS_PRERELEASE = /(?:alpha|canary)/.test(CLI_VERSION)
const STARTUPJS_VERSION = IS_PRERELEASE ? `^${CLI_VERSION.replace(/\.\d+$/, '.0')}` : 'latest'

// TODO
// We need to get rid from nconf package and use dotenv
const DEPENDENCIES = [
  'axios@^0.26.0',
  'nconf@^0.10.0',
  `startupjs@${STARTUPJS_VERSION}`
]

const DEV_DEPENDENCIES = [
  '@babel/eslint-parser',
  'eslint',
  'eslint-config-standard',
  'eslint-config-standard-react',
  'eslint-plugin-import',
  'eslint-plugin-import-helpers',
  'eslint-plugin-n',
  'eslint-plugin-promise',
  'eslint-plugin-react',
  'eslint-plugin-react-pug',
  'eslint-plugin-react-hooks'
  // 'husky@^4.3.0',
  // 'lint-staged'
  // TODO
]
const EXPO_DEPENDENCIES = [
  'react-dom',
  'react-native-svg'
]
const REMOVE_DEPENDENCIES = [
  '@babel/core'
]
const REMOVE_FILES = []

const TEMPLATES = {
  blank: {
    path: '/templates/blank'
  },
  ui: {
    path: '/templates/ui',
    dependencies: [
      'react-native-collapsible',
      'react-native-color-picker',
      'react-native-tab-view',
      `@startupjs/ui@${STARTUPJS_VERSION}`
    ],
    expoDependencies: [
      '@react-native-picker/picker',
      'react-native-gesture-handler',
      'react-native-pager-view'
    ]
  }
}

export default function getConfig (templateName) {
  const {
    path: templatePath,
    dependencies = [],
    devDependencies = [],
    expoDependencies = []
  } = TEMPLATES[templateName]

  const __filename = url.fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  return {
    path: path.join(__dirname, templatePath),
    dependencies: DEPENDENCIES.concat(dependencies),
    devDependencies: DEV_DEPENDENCIES.concat(devDependencies),
    expoDependencies: EXPO_DEPENDENCIES.concat(expoDependencies),
    removeDependencies: REMOVE_DEPENDENCIES,
    removeFiles: REMOVE_FILES
  }
}
