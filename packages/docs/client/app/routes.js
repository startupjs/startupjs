export default function (components = {}) {
  return [
    {
      path: '/docs/:lang?',
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
