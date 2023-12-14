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
    sqliteDb.all('SELECT collection, id, data, lastOp FROM documents', [], (err, rows) => {
      if (err) return reject(err)

      for (const [index, row] of rows.entries()) {
        const lastSnapshot = JSON.parse(row.data)
        const lastOp = JSON.parse(row.lastOp)

        if (!mingo.ops[row.collection]) {
          mingo.ops[row.collection] = {}
          mingo.docs[row.collection] = {}
        }

        const nowTs = Date.now()
        const snapshot = {
          id: lastSnapshot.id,
          v: lastSnapshot.v,
          type: lastSnapshot.type,
          data: lastSnapshot.data,
          m: {
            ctime: nowTs,
            mtime: nowTs
          }
        }
        const op = {
          src: lastOp.src,
          seq: index,
          v: lastOp.v,
          create: {
            type: lastSnapshot.type,
            data: lastSnapshot.data
          },
          m: {
            ts: nowTs
          }
        }

        // This segment ensures continuous client operation after a server restart.
        // During updates in sharedb, there's a version check using db._getVersionSync(collection, id),
        // which returns the length of the document's operation array.
        // This check prevents adding data with an incorrect version if the document's operations are empty.
        // Our solution circumvents this check so that a client,
        // remaining connected during a server restart, can retrieve the latest version and continue functioning.
        mingo.ops[row.collection][row.id] = [...new Array(lastOp.v), op]
        mingo.docs[row.collection][row.id] = snapshot
      }

      console.log('DB data was loaded from SQLite to shareDbMingo')
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
