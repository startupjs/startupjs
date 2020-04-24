module.exports = function (components = {}) {
  return [
    {
      path: '/docs/:lang?',
      exact: true,
      component: components.PHome
    },
    {
      path: '/docs/:lang/:docName',
      exact: true,
      component: components.PDoc
    },
    {
      path: '/docs/:lang/sandbox/:componentName',
      exact: true,
      component: components.PSandbox
    }
  ]
}
