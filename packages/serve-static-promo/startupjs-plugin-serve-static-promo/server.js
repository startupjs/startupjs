import { serveStaticPromo } from '../server'

export default (options) => ({
  api (expressApp) {
    expressApp.use(serveStaticPromo())
  }
})
