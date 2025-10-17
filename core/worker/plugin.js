import { createPlugin, getPlugin } from 'startupjs/registry'
import initDashboardRoute from './initDashboardRoute.js'

const workerStarted = false

export default createPlugin({
  name: 'worker',
  enabled: true,
  server: (pluginOptions) => ({
    async serverRoutes (expressApp) {
      const plugin = getPlugin('worker')

      const dashboardParams = plugin.optionsByEnv?.server?.dashboard

      if (dashboardParams) {
        initDashboardRoute({
          expressApp,
          ...dashboardParams
        })
      }

      const autoStart = plugin.optionsByEnv?.server?.autoStart ?? pluginOptions?.autoStart ?? true

      if (autoStart && !workerStarted) {
        workerStarted = true
        const { default: startWorker } = await import('./index.js')
        await startWorker()
      }
    },
  })
})
