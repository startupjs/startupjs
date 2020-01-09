import * as pages from './pages'
import getRoutes from './routes'
import './icons.js'

export { default as Layout } from '@startupjs/ui/components/Layout'
export const routes = getRoutes(pages)
