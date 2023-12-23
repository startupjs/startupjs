import { initPm, pr, task } from './pm/index.js'
import postinstall from './postinstall.js'
import server from './server.js'

export default [
  initPm,
  pr,
  task,
  postinstall,
  server
]
