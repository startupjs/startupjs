import createChannel from '@startupjs/channel/server'
import { connection, setConnection, setFetchOnly } from './orm/connection.js'

export { default as ShareDB } from 'sharedb'

export default function initConnection (backend, options) {
  if (!backend) throw Error('backend is required')
  if (connection) throw Error('Connection already exists')
  setConnection(backend.connect())
  setFetchOnly(true)
  return createChannel(backend, options)
}
