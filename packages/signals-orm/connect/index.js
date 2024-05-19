import Socket from '@startupjs/channel'
import Connection from './sharedbConnection.cjs'
import { connection, setConnection } from '../orm/connection.js'

export default function connect ({
  baseUrl,
  ...options
} = {}) {
  if (connection) return
  const socket = new Socket({ baseUrl, ...options })
  setConnection(new Connection(socket))
}
