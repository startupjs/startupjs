import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { AVAILABLE_WORKERS, getQueue } from './runtime.js'

export default function initDashboardRoute ({
  expressApp,
  route,
  readOnlyMode = true
}) {
  if (!route) {
    console.error('[@startupjs/worker] initDashboardRoute: no route provided')
    return
  }

  const serverAdapter = new ExpressAdapter()
  serverAdapter.setBasePath(route)

  createBullBoard({
    queues: AVAILABLE_WORKERS.map(workerName => new BullMQAdapter(getQueue(workerName), { readOnlyMode })),
    serverAdapter
  })

  expressApp.use(route, serverAdapter.getRouter())
}
