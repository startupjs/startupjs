import { routes, Layout as DefaultLayout } from './app'
import { initConfig } from './config'

export default function initOrgs (config, Layout) {
  initConfig(config)

  return {
    routes,
    Layout: Layout || DefaultLayout
  }
}
