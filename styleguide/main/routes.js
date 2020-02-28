export default (components = {}) => [
  {
    path: '/:componentName?',
    exact: true,
    component: components.PStyleguide
  }
]
