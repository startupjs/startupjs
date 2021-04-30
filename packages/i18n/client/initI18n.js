import { initConfig } from './config'
import { routes, Layout as DefaultLayout } from './app'

export default function initI18n (config, Layout) {
  initConfig(config)

  return {
    routes,
    Layout: Layout || DefaultLayout
  }
}
