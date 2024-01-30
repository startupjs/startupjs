import ShareDbMingoMemory from 'sharedb-mingo-memory'
import { resolve } from 'path'
import sqlite3 from 'sqlite3'
import { v4 as uuid } from 'uuid'
import { loadSqliteDbToMingo, getExistingSqliteDb } from './utils.js'

const DEFAULT_DB_PATH = './sqlite.db'

export const { db, sqlite } = await getMingoSqliteDb({
  dbPath: process.env.DB_PATH,
  loadSnapshotPath: process.env.DB_LOAD_SNAPSHOT
})

async function getMingoSqliteDb ({ dbPath, loadSnapshotPath }) {
  const db = new ShareDbMingoMemory()
  dbPath = resolve(dbPath || DEFAULT_DB_PATH)
  const sqliteDb = await getOrCreateSqliteDb(dbPath)

  await deleteExpiredDocumentsOps(sqliteDb)

  if (loadSnapshotPath) {
    const snapshotSqliteDb = getExistingSqliteDb(loadSnapshotPath)
    await cloneSqliteDb(snapshotSqliteDb, sqliteDb)
  }

  await loadSqliteDbToMingo(sqliteDb, db)

  patchMingoForSQLitePersistence(sqliteDb, db)

  return { db, sqlite: sqliteDb }
}

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

              callback(null, true)
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

async function getOrCreateSqliteDb (dbPath) {
  const sqliteDb = new sqlite3.Database(dbPath)

  return new Promise((resolve, reject) => {
    sqliteDb.run(
      'CREATE TABLE IF NOT EXISTS documents (' +
      'collection TEXT, ' +
      'id TEXT, ' +
      'data TEXT, ' +
      'PRIMARY KEY (collection, id))',
      (err) => {
        if (err) return reject(err)

        sqliteDb.run(
          'CREATE TABLE IF NOT EXISTS ops (' +
          'id UUID PRIMARY KEY, ' +
          'collection TEXT, ' +
          'documentId TEXT, ' +
          'op TEXT)',
          (err) => {
            if (err) return reject(err)

            console.log('DB SQLite was created from file', dbPath)
            resolve(sqliteDb)
          }
        )
      }
    )
  })
}

async function cloneSqliteDb (source, target) {
  return new Promise((resolve, reject) => {
    source.parallelize(() => {
      source.serialize(() => {
        source.all('SELECT * FROM documents', [], (err, rows) => {
          if (err) return reject(err)

          rows.forEach((row) => {
            target.run('INSERT INTO documents (collection, id, data) VALUES (?, ?, ?)', [row.collection, row.id, row.data], (err) => {
              if (err) return reject(err)
            })
          })
          resolve()
        })
      })

      source.serialize(() => {
        source.all('SELECT * FROM ops', [], (err, rows) => {
          if (err) return reject(err)

          rows.forEach((row) => {
            target.run('INSERT INTO ops (id, collection, documentId, op) VALUES (?, ?, ?, ?)', [row.id, row.collection, row.documentId, row.op], (err) => {
              if (err) return reject(err)
            })
          })
          resolve()
        })
      })
    })
  })
}
