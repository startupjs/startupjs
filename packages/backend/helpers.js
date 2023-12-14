import sqlite3 from 'sqlite3'

async function getSqliteDb (filename) {
  const sqliteDb = new sqlite3.Database(filename)

  return new Promise((resolve, reject) => {
    sqliteDb.run(
      'CREATE TABLE IF NOT EXISTS documents (' +
      'collection TEXT, ' +
      'id TEXT, ' +
      'data TEXT, ' +
      'lastOp TEXT, ' +
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
      for (const [index, _row] of rows.entries()) {
        const row = JSON.parse(_row.data)
        const lastOp = JSON.parse(_row.lastOp)

        if (!mingo.ops[_row.collection]) {
          mingo.ops[_row.collection] = {}
        }

        // action required for expected result from db._getVersionSync()
        // commit version of snapshot shold be equal length of all ops
        mingo.ops[_row.collection][_row.id] = new Array(lastOp.v)

        const nowMs = Date.now()
        const snapshot = {
          id: row.id,
          v: row.v,
          type: row.type,
          data: row.data,
          m: {
            ctime: nowMs,
            mtime: nowMs
          }
        }
        const op = {
          src: lastOp.src,
          seq: index,
          v: lastOp.v,
          create: {
            type: row.type,
            data: row.data
          },
          m: {
            ts: nowMs
          }
        }

        commits.push(new Promise((resolve, reject) => {
          mingo.commit(_row.collection, _row.id, op, snapshot, null, (err, committed) => {
            if (err) return reject(err)

            resolve(committed)
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
          target.run('INSERT INTO documents (collection, id, data, lastOp) VALUES (?, ?, ?, ?)', [row.collection, row.id, row.data, row.lastOp], (err) => {
            if (err) return reject(err)
          })
        })
        resolve()
      })
    })
  })
}

export { getSqliteDb, loadSqliteDbToMingo, cloneSqliteDb }
