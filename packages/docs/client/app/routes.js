module.exports = function (components = {}) {
  return [
    {
      path: '/docs/:lang?',
      exact: true,
      component: components.PHome
    },
    {
      path: '/docs/:lang/sandbox/:componentName',
      exact: true,
      component: components.PSandbox
    },
    {
      path: '/docs/:lang/docs/:docName',
      exact: true,
      component: components.PDoc
    }
  ]
}
