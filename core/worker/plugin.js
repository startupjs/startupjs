import { createPlugin, getPlugin } from 'startupjs/registry'
import initDashboardRoute from './initDashboardRoute.js'

export default createPlugin({
  name: 'worker',
  enabled: true,
  server: () => ({
    serverRoutes (expressApp) {
      const plugin = getPlugin('worker')

      const dashboardParams = plugin.optionsByEnv.server.dashboard

      if (dashboardParams) {
        initDashboardRoute({
          expressApp,
          ...dashboardParams
        })
      }
    }
  })
})
