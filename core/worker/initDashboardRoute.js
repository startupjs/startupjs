import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'

export default async function initDashboardRoute ({
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

  const { queue } = (await import('./queue.js'))

  createBullBoard({
    queues: [new BullMQAdapter(queue, { readOnlyMode })],
    serverAdapter
  })
  expressApp.use(route, serverAdapter.getRouter())
}
