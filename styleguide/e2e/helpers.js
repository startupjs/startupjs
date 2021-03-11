const { x } = require('@startupjs/e2e/helpers')

function goTo () {
  let componentName = ''
  return {
    run: async function goTo () {
      await x('#searchInput').toBeVisible()
      await x('#searchInput').replaceText('/test/' + componentName)
    },
    changeComponent: newComponentName => {
      componentName = newComponentName
    }
  }
}

module.exports = {
  goTo: goTo()
}
