export default (components = {}) => [
  {
    path: '/',
    exact: true,
    redirect: '/docs'
  },
  {
    path: '/test',
    exact: true,
    component: components.PTest
  }
]
