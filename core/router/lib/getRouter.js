import Routes from './Routes'

export default function getRouter (routes, { basename } = {}) {
  if (!Array.isArray(routes)) throw Error(ERRORS.notArray)
  return function StartupjsRouter () {
    return <Routes basename={basename} routes={routes} />
  }
}

const ERRORS = {
  notArray: '<Routes>: `routes` prop must be an array'
}
