import createChannel from '@startupjs/channel/server'
import { connection, setConnection } from './orm/connection.js'

export { default as ShareDB } from 'sharedb'

export default function createConnectionHandlers (backend, options) {
  if (!backend) throw Error('backend is required')
  if (connection) throw Error('Connection already exists')
  setConnection(backend.connect())
  return createChannel(backend, options)
}
