import nodePath from 'path'

const CWD = process.cwd()

const LIBS = {
  'react-native': 'react-native-web',
  'startupjs/init': '@startupjs/init/lib/native',
  '@fortawesome/react-native-fontawesome': '@fortawesome/react-fontawesome'
}

const FOLDERS = [
  'components',
  'helpers',
  'clientHelpers',
  'serverHelpers',
  'isomorphicHelpers',
  'model',
  'main',
  'styles',
  'appConstants'
].reduce((all, current) => ({
  ...all,
  [current]: nodePath.join(CWD, current)
}), {})

export default function viteStartupjsConfig () {
  return {
    name: 'startupjs:config',
    config () {
      return {
        resolve: {
          alias: {
            ...LIBS,
            ...FOLDERS
          },
          extensions: [
            '.web.mjs',
            '.web.cjs',
            '.web.js',
            '.web.ts',
            '.web.jsx',
            '.web.tsx',
            '.web.json',
            '.mjs',
            '.cjs',
            '.js',
            '.ts',
            '.jsx',
            '.tsx',
            '.json'
          ]
        },
        optimizeDeps: {
          include: [
            '@startupjs/babel-plugin-rn-stylename-to-style/process'
          ],
          exclude: [
            '@env'
          ]
        },
        server: {
          port: 3010,
          https: true
        }
      }
    }
  }
}
