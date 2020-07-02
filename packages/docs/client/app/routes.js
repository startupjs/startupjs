export default function (components = {}) {
  return [
    {
      path: '/docs/:lang?',
      exact: true,
      component: components.PHome
    },
    {
      path: '/docs/:lang/:path+',
      exact: true,
      component: components.PDoc,
      name: 'docs:doc'
    }
  ]
}
