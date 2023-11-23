import promisifyRacer from '@startupjs/orm/lib/promisifyRacer.js'
import racer from 'racer'
import sharedb from 'sharedb'

const MemoryDB = sharedb.MemoryDB

promisifyRacer()

export default function getDbs () {
  const db = new MemoryDB()
  const backend = racer.createBackend({ db })

  return { backend, db }
}
