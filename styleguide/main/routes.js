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
    path: '/playground1',
    exact: true,
    component: components.PPlayground1
  },
  {
    path: '/playground2',
    exact: true,
    component: components.PPlayground2
  },
  {
    path: '/playgroundSignals',
    exact: true,
    component: components.PPlaygroundSignals
  },
  {
    path: '/playwright-e2e-test',
    exact: true,
    component: components.PPlaywrightExample
  }
]
