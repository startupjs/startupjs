export default (components = {}) => [
  {
    path: '/:section?/:component?',
    exact: true,
    component: components.PComponent,
    filters: [isLoggedIn]
  }
]

async function isLoggedIn (model, next, redirect) {
  const { section, component } = model.get('$render.match.params')
  if (!section) console.log('no section')
  if (!component) console.log('component')
  next()
}
