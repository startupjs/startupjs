const upstreamTransformer = require('@expo/metro-config/babel-transformer')

module.exports.transform = async ({ src, filename, options }) => {
  console.log('>>> custom transform')
  if (/\.[cm]?[jt]sx?$/.test(filename)) {
    console.log('> TEST custom metro')
  }
  // Pass the source through the upstream Expo transformer.
  return upstreamTransformer.transform({ src, filename, options })
}
