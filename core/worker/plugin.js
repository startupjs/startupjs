import { createPlugin, getPlugin } from 'startupjs/registry'
import initDashboardRoute from './initDashboardRoute.js'

export default createPlugin({
  name: 'worker',
  enabled: true,
  server: (pluginOptions) => ({
    serverRoutes (expressApp) {
      const plugin = getPlugin('worker')

      const dashboardParams = plugin.optionsByEnv?.server?.dashboard

      if (dashboardParams) {
        initDashboardRoute({
          expressApp,
          ...dashboardParams
        })
      }
    },
    async onServerStart () {
      const plugin = getPlugin('worker')
      const autoStart = plugin.optionsByEnv?.server?.autoStart ?? pluginOptions?.autoStart ?? true

      if (autoStart) {
        const { default: startWorker } = await import('./index.js')
        await startWorker()
      }
    }
  })
})
