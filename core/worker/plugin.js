import { createPlugin } from 'startupjs/registry'
import initDashboardRoute from './initDashboardRoute.js'

export default createPlugin({
  name: 'worker',
  enabled: true,
  server: (options = {}) => {
    const {
      dashboard,
      autoStart = true,
      ...initOptions
    } = options

    return {
      async serverRoutes (expressApp) {
        let dashboardOptions = dashboard

        if (dashboardOptions === true) dashboardOptions = {}

        if (dashboardOptions) {
          initDashboardRoute({
            expressApp,
            ...dashboardOptions
          })
        }

        if (autoStart) {
          const { default: initWorker } = await import('./init.js')
          await initWorker(initOptions)
        }
      }
    }
  }
})
