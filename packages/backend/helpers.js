import sqlite3 from 'sqlite3'

const EXPIRED_PERIOD_MS = 24 * 60 * 60 * 1000

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

      for (const row of rows) {
        if (!mingo.ops[row.collection]) {
          mingo.ops[row.collection] = {}
          mingo.docs[row.collection] = {}
        }

        const expiredDateMs = Date.now() - EXPIRED_PERIOD_MS
        const ops = JSON.parse(row.ops)
        const lastIndex = ops.length - 1
        mingo.ops[row.collection][row.id] = ops.map((op, i) => op !== null && (op.m.ts >= expiredDateMs || i === lastIndex) ? op : null)
        mingo.docs[row.collection][row.id] = JSON.parse(row.data)
      }

      resolve()
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
