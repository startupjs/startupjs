import { serveStaticPromo } from '../server'

export default (serverContext, options) => ({
  api (expressApp) {
    expressApp.use(serveStaticPromo())
  }
})
