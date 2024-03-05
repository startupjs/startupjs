import ShareDbMingoMemory from 'sharedb-mingo-memory'
import { resolve } from 'path'
import sqlite3 from 'sqlite3'
import { v4 as uuid } from 'uuid'
import { loadSqliteDbToMingo, getExistingSqliteDb } from './utils.js'

const DEFAULT_DB_PATH = './local.db'

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
    originalCommit.call(this, collection, docId, op, snapshot, options, async err => {
      if (err) return callback(err)

      try {
        await new Promise((resolve, reject) => {
          sqliteDb.run(`
            REPLACE INTO documents (collection, id, data) VALUES (?, ?, ?)
          `, [collection, docId, JSON.stringify(snapshot)], err => err ? reject(err) : resolve())
        })
        await new Promise((resolve, reject) => {
          sqliteDb.run(`
            INSERT INTO ops (id, collection, documentId, op) VALUES (?, ?, ?, ?)
          `, [uuid(), collection, docId, JSON.stringify(op)], err => err ? reject(err) : resolve())
        })
      } catch (err) {
        throw Error('Error saving to SQLite:\n', err.message)
      }

      callback(null, true)
    })
  }
}

async function deleteExpiredDocumentsOps (sqliteDb) {
  return await new Promise((resolve, reject) => {
    sqliteDb.run(`
      DELETE FROM ops
      WHERE
          json_extract(op, '$.m.ts') < (strftime('%s', 'now') - 24 * 60 * 60 ) * 1000
          AND
          json_extract(op, '$.v') < (
              SELECT (json_extract(data, '$.v') - 1)
              FROM documents
              WHERE documents.id = ops.documentId AND documents.collection = ops.collection
          );
    `, err => err ? reject(err) : resolve())
  })
}

async function getOrCreateSqliteDb (dbPath) {
  const sqliteDb = new sqlite3.Database(dbPath)

  try {
    await new Promise((resolve, reject) => {
      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS documents (
          collection TEXT,
          id TEXT,
          data TEXT,
          PRIMARY KEY (collection, id)
        )
      `, err => err ? reject(err) : resolve())
    })
    await new Promise((resolve, reject) => {
      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS ops (
          id UUID PRIMARY KEY,
          collection TEXT,
          documentId TEXT,
          op TEXT
        )
      `, err => err ? reject(err) : resolve())
    })
    await new Promise((resolve, reject) => {
      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS files (
          id TEXT PRIMARY KEY,
          data BLOB,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, err => err ? reject(err) : resolve())
    })
  } catch (err) {
    throw Error('Error creating SQLite file db and/or tables:\n' + err.message)
  }
  console.log('Using SQLite DB from file:', dbPath)
  return sqliteDb
}

// clone each table from source to target
// TODO: Do it in batches of 100 to avoid memory issues.
async function cloneSqliteDb (source, target) {
  try {
    { // clone 'documents'
      const rows = await new Promise((resolve, reject) => {
        source.all('SELECT * FROM documents', [], (err, rows) => err ? reject(err) : resolve(rows))
      })
      const promises = []
      for (const row of rows) {
        promises.push(new Promise((resolve, reject) => {
          target.run(`
            INSERT INTO documents (collection, id, data) VALUES (?, ?, ?)
          `, [row.collection, row.id, row.data], err => err ? reject(err) : resolve())
        }))
      }
      await Promise.all(promises)
    }
    { // clone 'ops'
      const rows = await new Promise((resolve, reject) => {
        source.all('SELECT * FROM ops', [], (err, rows) => err ? reject(err) : resolve(rows))
      })
      const promises = []
      for (const row of rows) {
        promises.push(new Promise((resolve, reject) => {
          target.run(`
            INSERT INTO ops (id, collection, documentId, op) VALUES (?, ?, ?, ?)
          `, [row.id, row.collection, row.documentId, row.op], err => err ? reject(err) : resolve())
        }))
      }
      await Promise.all(promises)
    }
    { // clone 'files'
      // TODO: Clone them one by one to avoid memory issues, since files are large.
      const rows = await new Promise((resolve, reject) => {
        source.all('SELECT * FROM files', [], (err, rows) => err ? reject(err) : resolve(rows))
      })
      const promises = []
      for (const row of rows) {
        promises.push(new Promise((resolve, reject) => {
          target.run(`
            INSERT INTO files (id, data) VALUES (?, ?)
          `, [row.id, row.data], err => err ? reject(err) : resolve())
        }))
        await Promise.all(promises)
      }
    }
  } catch (err) {
    throw Error('Error cloning SQLite DB:\n' + err.message)
  }
}
