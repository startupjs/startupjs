import sqlite3 from 'sqlite3'
import { v1 as uuid } from 'uuid'

async function getSqliteDb (filename) {
  const sqliteDb = new sqlite3.Database(filename)

  return new Promise((resolve, reject) => {
    sqliteDb.run(
      'CREATE TABLE IF NOT EXISTS documents (' +
      'collection TEXT, ' +
      'id TEXT, ' +
      'data TEXT, ' +
      'ops TEXT, ' +
      'PRIMARY KEY (collection, id))',
      (err) => {
        if (err) return reject(err)

        console.log('DB SQLite was created from file', filename)
        resolve(sqliteDb)
      }
    )
  })
}

async function loadSqliteDbToMingo (sqliteDb, mingo) {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT collection, id, data, ops FROM documents', [], (err, rows) => {
      if (err) return reject(err)
      const commits = []
      for (const _row of rows) {
        const row = JSON.parse(_row.data)
        row.v = 1

        const nowMs = Date.now()
        const snapshot = {
          id: row.id,
          v: 1,
          type: row.type,
          data: row.data,
          m: {
            ctime: nowMs,
            mtime: nowMs
          }
        }
        const op = {
          src: uuid().replaceAll('-', ''),
          seq: 1,
          v: 0,
          create: {
            type: row.type,
            data: row.data
          },
          m: {
            ts: nowMs
          }
        }

        commits.push(new Promise((resolve, reject) => {
          mingo.commit(_row.collection, _row.id, op, snapshot, null, (err, commited) => {
            if (err) return reject(err)

            if (commited) {
              if (!mingo.docs[_row.collection]) {
                mingo.docs[_row.collection] = {}
              }
              mingo.docs[_row.collection][_row.id] = row
            }

            resolve(commited)
          })
        }))
      }

      Promise.all(commits).then((res) => {
        console.log('DB data was loaded from SQLite to shareDbMingo', res)

        resolve()
      }).catch(reject)
    })
  })
}

async function cloneSqliteDb (source, target) {
  return new Promise((resolve, reject) => {
    source.serialize(() => {
      source.all('SELECT * FROM documents', [], (err, rows) => {
        if (err) return reject(err)

        rows.forEach((row) => {
          target.run('INSERT INTO documents (collection, id, data, ops) VALUES (?, ?, ?, ?)', [row.collection, row.id, row.data, row.ops], (err) => {
            if (err) return reject(err)
          })
        })
        resolve()
      })
    })
  })
}

export { getSqliteDb, loadSqliteDbToMingo, cloneSqliteDb }
