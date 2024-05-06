import ShareBackend from 'sharedb'
import ShareDBMingo from 'sharedb-mingo-memory'

export default createConnection()

function createConnection () {
  const backend = new ShareBackend({ db: new ShareDBMingo() })
  return backend.connect()
}
