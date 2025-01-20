export default async function maybeRemoveJobSchedulers (queue, relevantSchedulerIds) {
  const existingSchedulers = await queue.getJobSchedulers()

  for (const scheduler of existingSchedulers) {
    if (relevantSchedulerIds.includes(scheduler.name)) continue

    await queue.removeJobScheduler(scheduler.name)
  }
}
