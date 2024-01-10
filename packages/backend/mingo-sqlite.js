import ShareDbMingoMemory from 'sharedb-mingo-memory'
import path from 'path'
import sqlite3 from 'sqlite3'
import { v4 as uuid } from 'uuid'
import { cloneSqliteDb, getSqliteDb, loadSqliteDbToMingo } from './helpers.js'

// override the commit method to save changes to SQLite
function patchMingoForSQLitePersistence (sqliteDb, shareDbMingo) {
  const originalCommit = shareDbMingo.commit

  shareDbMingo.commit = function (collection, docId, op, snapshot, options, callback) {
    originalCommit.call(this, collection, docId, op, snapshot, options, (err) => {
      if (err) return callback(err)

      sqliteDb.run(
        'REPLACE INTO documents (collection, id, data) VALUES (?, ?, ?)',
        [collection, docId, JSON.stringify(snapshot)],
        (err) => {
          if (err) {
            console.error(err.message)
            return callback(err)
          }

          sqliteDb.run(
            'INSERT INTO ops (id, collection, documentId, op) VALUES (?, ?, ?, ?)',
            [uuid(), collection, docId, JSON.stringify(op)],
            (err) => {
              if (err) {
                console.error(err.message)
                return callback(err)
              }

              callback()
            }
          )
        }
      )
    })
  }
}

function deleteExpiredDocumentsOps (sqliteDb) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(`
      DELETE FROM ops
      WHERE
          json_extract(op, '$.m.ts') < (strftime('%s', 'now') - 24 * 60 * 60 ) * 1000
          AND
          json_extract(op, '$.v') < (
              SELECT (json_extract(data, '$.v') - 1)
              FROM documents
              WHERE documents.id = ops.documentId AND documents.collection = ops.collection
          );
    `, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

const { DB_PATH, DB_LOAD_SNAPSHOT } = process.env
const db = new ShareDbMingoMemory()
const sourceSqliteDbPath = DB_LOAD_SNAPSHOT ? path.join(process.cwd(), DB_LOAD_SNAPSHOT) : undefined
const targetSqliteDbPath = path.join(process.cwd(), DB_PATH || 'sqlite.db')
const targetSqliteDb = await getSqliteDb(targetSqliteDbPath)

await deleteExpiredDocumentsOps(targetSqliteDb)

if (sourceSqliteDbPath) {
  const sourceSqliteDb = new sqlite3.Database(sourceSqliteDbPath)
  await cloneSqliteDb(sourceSqliteDb, targetSqliteDb)
}

await loadSqliteDbToMingo(targetSqliteDb, db)

patchMingoForSQLitePersistence(targetSqliteDb, db)

export default db
