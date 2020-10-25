export const ACTIONS = {
  test: function (model, task, done) {
    const options = task.options || {}
    const duration = options.duration || 50
    setTimeout(() => {
      // console.log('TASK', task)
      done()
    }, duration)
  },
  testAsync: async (model, task) => {
    const options = task.options || {}
    const duration = options.duration || 50
    await new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  },
  print: (model, task, done) => {
    const options = task.options || {}
    const duration = options.duration || 50
    setTimeout(() => {
      console.log('\n\n\nTASK', task, '\n\n\n')
      done()
    }, duration)
  }
}
