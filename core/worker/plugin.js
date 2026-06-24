import { createPlugin } from 'startupjs/registry'

const importLocalModule = createLocalModuleImporter()

export default createPlugin({
  name: 'worker',
  enabled: true,
  server: (options = {}) => {
    const {
      dashboard,
      autoStart = true,
      autoStartProduction = true,
      ...initOptions
    } = options

    return {
      async serverRoutes (expressApp) {
        let dashboardOptions = dashboard

        if (dashboardOptions === true) dashboardOptions = {}

        if (dashboardOptions) {
          const { default: initDashboardRoute } = await importLocalModule(
            new URL('./initDashboardRoute.js', import.meta.url).href
          )
          initDashboardRoute({
            expressApp,
            ...dashboardOptions
          })
        }

        const isProduction = process.env.NODE_ENV === 'production'
        const shouldAutoStart = autoStart && (!isProduction || autoStartProduction)

        if (shouldAutoStart) {
          const { default: initWorker } = await importLocalModule(
            new URL('./init.js', import.meta.url).href
          )
          await initWorker(initOptions)
        }
      }
    }
  }
})

function createLocalModuleImporter () {
  // Keep server-only worker modules lazy without exposing literal dynamic imports
  // to Metro/Expo web static analysis through startupjs.config.js.
  return new Function('specifier', 'return import(specifier)') // eslint-disable-line no-new-func
}
