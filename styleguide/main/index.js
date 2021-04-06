import getRoutes from './routes'
import * as pages from './pages'

export { default as Layout } from './Layout'
export const routes = getRoutes(pages)
