import ShareDbMingoMemory from 'sharedb-mingo-memory'
import path from 'path'
import { cloneSqlDb, createSqlDb, loadDataToMingo } from './helpers.js'

// override the commit method to save changes to SQLite
function patchMingoCommit (sqlite, shareDbMingo) {
  const originalCommit = shareDbMingo.commit

  shareDbMingo.commit = function (collection, docId, op, snapshot, options, callback) {
    originalCommit.call(this, collection, docId, op, snapshot, options, (err) => {
      if (err) return callback(err)

      sqlite.run(
        'REPLACE INTO documents (collection, id, data) VALUES (?, ?, ?)',
        [collection, docId, JSON.stringify(snapshot)],
        (err) => {
          if (err) {
            console.error(err.message)
            return callback(err)
          }

          console.log(`Document with id ${docId} saved to SQLite`)
          callback()
        }
      )
    })
  }
}

const { DB_PATH, DB_LOAD_SNAPSHOT } = process.env

const db = new ShareDbMingoMemory()
const sourcePath = DB_LOAD_SNAPSHOT || DB_PATH || 'sqlite.db'
let sqliteDb = await createSqlDb(path.join(process.cwd(), sourcePath))

await loadDataToMingo(sqliteDb, db)

if (DB_PATH && DB_PATH !== sourcePath) {
  const sourceDb = sqliteDb
  sqliteDb = await createSqlDb(path.join(process.cwd(), DB_PATH || 'sqlite.db'))

  await cloneSqlDb(sourceDb, sqliteDb)
}

patchMingoCommit(sqliteDb, db)

export default db
