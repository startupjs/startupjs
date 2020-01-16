import * as pages from './pages'
import getRoutes from './routes'

export { default as Layout } from './Layout'
export const routes = getRoutes(pages)
