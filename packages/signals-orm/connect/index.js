import Socket from '@startupjs/channel'
import { Connection } from 'sharedb/lib/client'
import { connection, setConnection } from '../orm/connection.js'

export default function connect ({
  baseUrl,
  channel
} = {}) {
  if (connection) return
  const socket = new Socket({ baseUrl, ...channel })
  setConnection(new Connection(socket))
}
