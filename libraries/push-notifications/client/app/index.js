import getRoutes from './routes'
import * as pages from './pages'
import Layout from './Layout'
const routes = getRoutes(pages)

export default {
  Layout,
  routes
}
