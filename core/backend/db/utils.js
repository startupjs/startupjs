import sqlite3 from 'sqlite3'
import { existsSync } from 'fs'
import { resolve } from 'path'

export async function loadSqliteDbToMingo (sqliteDb, mingo) {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT collection, id, data FROM documents', [], (err, docsRows) => {
      if (err) return reject(err)

      sqliteDb.all('SELECT collection, documentId, op FROM ops', [], (err, opsRows) => {
        if (err) return reject(err)

        const docsOpsByDocId = opsRows.reduce((byId, row) => {
          const values = byId[`${row.collection}.${row.documentId}`] || []
          const op = JSON.parse(row.op)
          return { ...byId, [`${row.collection}.${row.documentId}`]: [...values, op] }
        }, {})

        for (const row of docsRows) {
          if (!mingo.docs[row.collection]) {
            mingo.docs[row.collection] = {}
            mingo.ops[row.collection] = {}
          }

          const docOps = (docsOpsByDocId[`${row.collection}.${row.id}`] || []).sort((a, b) => a.v - b.v)
          const firstOp = docOps[0]

          mingo.ops[row.collection][row.id] = firstOp?.v > 0 ? [...new Array(firstOp.v), ...docOps] : docOps
          mingo.docs[row.collection][row.id] = JSON.parse(row.data)
        }
        resolve()
        console.log('DB data was loaded from SQLite to shareDbMingo')
      })
    })
  })
}

export function getExistingSqliteDb (dbPath) {
  dbPath = resolve(dbPath)
  console.log('[mingo] Getting existing sqlite db from:', dbPath)
  if (!existsSync(dbPath)) {
    throw Error('[mingo] SQLite db file doesn\'t exist:', dbPath)
  }
  return new sqlite3.Database(dbPath)
}
