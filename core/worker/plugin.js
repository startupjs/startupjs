import { createPlugin, getPlugin } from 'startupjs/registry'
import initDashboardRoutes from './initDashboardRoutes.js'

export default createPlugin({
  name: 'worker',
  enabled: true,
  order: 'router',
  server: () => ({
    serverRoutes (expressApp) {
      const plugin = getPlugin('worker')

      const dashboardParams = plugin.optionsByEnv.server.dashboard

      if (dashboardParams) {
        const { workerRoute, cronRoute } = dashboardParams

        initDashboardRoutes({
          expressApp,
          workerRoute,
          cronRoute
        })
      }
    }
  })
})
