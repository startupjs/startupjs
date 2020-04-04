export default (components = {}) => [
  {
    path: '/',
    exact: true,
    component: components.PHome
  },
  {
    path: '/:lang/sandbox/:componentName',
    exact: true,
    component: components.PSandbox
  },
  {
    path: '/:lang/docs/:docName',
    exact: true,
    component: components.PDoc
  }
]
