import * as pages from './pages'
import getRoutes from './routes'

export { default as Layout } from '@startupjs/ui/components/Layout'
export const routes = getRoutes(pages)
