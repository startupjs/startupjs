module.exports = function getConfig ({
  project = {},
  assets = []
} = {}) {
  return {
    project: {
      ios: project.ios || {},
      android: project.android || {}
    },
    assets: ['./public/fonts/', ...assets]
  }
}
