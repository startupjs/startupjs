export default function (components = {}) {
  return [
    {
      path: '/docs',
      exact: true,
      component: components.PHome
    },
    {
      path: '/docs/:path+',
      exact: true,
      component: components.PDoc,
      name: 'docs:doc'
    }
  ]
}
