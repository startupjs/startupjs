// DEPRECATED
console.warn(`
Using 'startupjs/bundler/metro.config.cjs' directly is deprecated and will be removed soon.
Instead please change your metro.config.js to:

  const { getDefaultConfig } = require('startupjs/metro-config')
  const config = getDefaultConfig(__dirname)
  // modify config here if needed
  // ...
  module.exports = config
`)

const DEFAULT_ASSET_EXTS = [
  // Image formats
  'bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp',
  // Video formats
  'm4v', 'mov', 'mp4', 'mpeg', 'mpg', 'webm',
  // Audio formats
  'aac', 'aiff', 'caf', 'm4a', 'mp3', 'wav',
  // Document formats
  'html', 'pdf', 'yaml', 'yml',
  // Font formats
  'otf', 'ttf',
  // Archives (virtual files)
  'zip'
]

const EXTENSIONS = ['js', 'jsx', 'json', 'mjs', 'cjs', 'ts', 'tsx', 'md', 'mdx', 'css', 'styl', 'svg']

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    }),
    babelTransformerPath: require.resolve('./lib/rnTransformer')
  },
  resolver: {
    assetExts: DEFAULT_ASSET_EXTS.filter(ext => ext !== 'svg'),
    sourceExts: EXTENSIONS
  }
}
