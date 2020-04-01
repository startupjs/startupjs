export default (components = {}) => [
  {
    path: '/',
    exact: true,
    component: components.PHome
  },
  {
    path: '/sandbox/:componentName',
    exact: true,
    component: components.PSandbox
  },
  {
    path: '/docs/:docName',
    exact: true,
    component: components.PDoc
  }
]
