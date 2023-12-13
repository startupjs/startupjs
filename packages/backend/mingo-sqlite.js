import ShareDbMingoMemory from 'sharedb-mingo-memory'
import path from 'path'
import sqlite3 from 'sqlite3'
import { cloneSqliteDb, getSqliteDb, loadSqliteDbToMingo } from './helpers.js'

// override the commit method to save changes to SQLite
function patchMingoForSQLitePersistence (sqliteDb, shareDbMingo) {
  const originalCommit = shareDbMingo.commit

  shareDbMingo.commit = function (collection, docId, op, snapshot, options, callback) {
    originalCommit.call(this, collection, docId, op, snapshot, options, (err) => {
      if (err) return callback(err)

      this.getOps(collection, docId, 0, undefined, {
        metadata: true
      }, (err, data) => {
        if (err) return callback(err)

        sqliteDb.run(
          'REPLACE INTO documents (collection, id, data, ops) VALUES (?, ?, ?, ?)',
          [collection, docId, JSON.stringify(snapshot), JSON.stringify(data)],
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
    })
  }
}

const { DB_PATH, DB_LOAD_SNAPSHOT } = process.env
const db = new ShareDbMingoMemory()
const sourceSqliteDbPath = DB_LOAD_SNAPSHOT ? path.join(process.cwd(), DB_LOAD_SNAPSHOT) : undefined
const targetSqliteDbPath = path.join(process.cwd(), DB_PATH || 'sqlite.db')
const targetSqliteDb = await getSqliteDb(targetSqliteDbPath)

if (sourceSqliteDbPath) {
  const sourceSqliteDb = new sqlite3.Database(sourceSqliteDbPath)
  await cloneSqliteDb(sourceSqliteDb, targetSqliteDb)
}

await loadSqliteDbToMingo(targetSqliteDb, db)

patchMingoForSQLitePersistence(targetSqliteDb, db)

export default db
