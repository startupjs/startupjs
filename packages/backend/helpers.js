import sqlite3 from 'sqlite3'

async function getSqliteDb (filename) {
  const sqliteDb = new sqlite3.Database(filename)

  return new Promise((resolve, reject) => {
    sqliteDb.run(
      'CREATE TABLE IF NOT EXISTS documents (' +
      'collection TEXT, ' +
      'id TEXT, ' +
      'data TEXT, ' +
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
    sqliteDb.all('SELECT collection, id, data FROM documents', [], (err, rows) => {
      if (err) return reject(err)
      const commits = []
      for (const row of rows) {
        commits.push(new Promise((resolve, reject) => {
          mingo.commit(row.collection, row.id, {}, JSON.parse(row.data), null, (err) => {
            if (err) return reject(err)

            resolve()
          })
        }))
      }

      Promise.all(commits).then(() => {
        console.log('DB data was loaded from SQLite to shareDbMingo')

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
          target.run('INSERT INTO documents (collection, id, data) VALUES (?, ?, ?)', [row.collection, row.id, row.data], (err) => {
            if (err) return reject(err)
          })
        })
        resolve()
      })
    })
  })
}

export { getSqliteDb, loadSqliteDbToMingo, cloneSqliteDb }
