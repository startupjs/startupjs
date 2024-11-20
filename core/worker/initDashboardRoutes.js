import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { ExpressAdapter } from '@bull-board/express'

export default async function initBullMQBoardRoutes ({ expressApp, cronRoute, workerRoute }) {
  const isSameRoute = workerRoute === cronRoute
  let serverAdapter
  let workerAdapter
  let cronAdapter
  let workerQueue
  let cronQueue

  if (isSameRoute) {
    serverAdapter = new ExpressAdapter()
    serverAdapter.setBasePath(cronRoute)
  } else {
    if (workerRoute) {
      workerAdapter = new ExpressAdapter()
      workerAdapter.setBasePath(workerRoute)
    }

    if (cronRoute) {
      cronAdapter = new ExpressAdapter()
      cronAdapter.setBasePath(cronRoute)
    }
  }

  if (isSameRoute || workerRoute) {
    workerQueue = (await import('../worker/queue.js')).default
  }

  if (isSameRoute || cronRoute) {
    cronQueue = (await import('../cron/queue.js')).default
  }

  if (isSameRoute) {
    createBullBoard({
      queues: [
        new BullMQAdapter(cronQueue, { readOnlyMode: true }),
        new BullMQAdapter(workerQueue, { readOnlyMode: true })
      ],
      serverAdapter
    })
    expressApp.use(cronRoute, serverAdapter.getRouter())
  } else {
    if (workerRoute) {
      createBullBoard({
        queues: [new BullMQAdapter(workerQueue, { readOnlyMode: true })],
        serverAdapter: workerAdapter
      })
      expressApp.use(workerRoute, workerAdapter.getRouter())
    }

    if (cronRoute) {
      createBullBoard({
        queues: [new BullMQAdapter(cronQueue, { readOnlyMode: true })],
        serverAdapter: cronAdapter
      })
      expressApp.use(cronRoute, cronAdapter.getRouter())
    }
  }
}
