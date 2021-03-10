const x = require('@startupjs/e2e/helpers')

async function goTo (componentName) {
  await x('#searchInput').toBeVisible()
  await x('#searchInput').replaceText('/test/' + componentName)
}

module.exports = { goTo }
