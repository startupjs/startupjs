// mock of client connection to sharedb to use inside tests.
// This just creates a sharedb server with in-memory database
// and creates a server connection to it.
import ShareBackend from 'sharedb'
import ShareDBMingo from 'sharedb-mingo-memory'
import { connection, setConnection } from '../orm/connection.js'

export default function connect () {
  if (connection) return
  const backend = new ShareBackend({ db: new ShareDBMingo() })
  setConnection(backend.connect())
}
