import sqlite3 from 'sqlite3'

async function getSqliteDb (filename) {
  const sqliteDb = new sqlite3.Database(filename)

  const dataTables = new Promise((resolve, reject) => {
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

            resolve()
          }
        )
      }
    )
  })

  const sessionsTable = new Promise((resolve, reject) => {
    sqliteDb.run(
      'CREATE TABLE IF NOT EXISTS sessions (' +
      'sid TEXT PRIMARY KEY, ' +
      'expired TEXT, ' +
      'sess TEXT)',
      (err) => {
        if (err) return reject(err)

        resolve()
      }
    )
  })

  await Promise.all([dataTables, sessionsTable])
  console.log('DB SQLite was created from file', filename)

  return sqliteDb
}

async function loadSqliteDbToMingo (sqliteDb, mingo) {
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

export { getSqliteDb, loadSqliteDbToMingo, cloneSqliteDb }
