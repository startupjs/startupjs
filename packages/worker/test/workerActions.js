let ACTIONS = global.DM_WORKER_ACTIONS = {}

ACTIONS.test = (model, task, done) => {
  const options = task.options || {}
  const duration = options.duration || 50
  setTimeout(() => { done() }, duration)
}

ACTIONS.testAsync = async (model, task) => {
  const options = task.options || {}
  const duration = options.duration || 50
  await new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}
