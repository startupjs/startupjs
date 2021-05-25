export default (components = {}) => [
  {
    path: '/',
    exact: true,
    redirect: '/docs'
  },
  {
    path: '/profile',
    exact: true,
    component: components.PProfile
  },
  {
    path: '/scrollable-anchors-example',
    exact: true,
    component: components.PAnchorsExample
  },
  {
    path: '/test/:componentName',
    exact: true,
    component: components.PTestComponent
  }
]
