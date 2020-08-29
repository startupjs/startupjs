exports.stripExport = function stripExport (source) {
  return source.replace(/^(?:export\s+default\s*|module\.exports\s*=\s*)/, '')
}
