module.exports = {
  rules: {
    // This is a copy of the no-unreachable rule from ESLint core,
    // but with `styl` template literals being ignored.
    // ref: https://github.com/eslint/eslint/blob/main/lib/rules/no-unreachable.js
    'no-unreachable': require('./rules/no-unreachable.js')
  }
}
