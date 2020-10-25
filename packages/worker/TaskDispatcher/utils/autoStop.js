import { EventEmitter } from 'events'

const WORKER_KILL_PROCESS_TIMEOUT = process.env.WORKER_KILL_PROCESS_TIMEOUT || 100

class AutoStop extends EventEmitter {
  constructor () {
    super()

    process.on('SIGTERM', this.onExit.bind(this))
    process.on('SIGINT', this.onExit.bind(this))
    process.on('SIGQUIT', this.onExit.bind(this))

    process.on('uncaughtException', (err) => {
      console.log('uncaught:', err, err.stack)
      this.onExit(100)
    })
  }

  onExit (code) {
    console.log('Exiting...')

    this.emit('exit')

    setTimeout(() => {
      process.exit(code)
    }, WORKER_KILL_PROCESS_TIMEOUT)
  }
}

export default new AutoStop()
