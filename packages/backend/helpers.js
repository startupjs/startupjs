import sqlite3 from 'sqlite3'

async function createSqlDb (filename) {
  const db = new sqlite3.Database(filename)

  return new Promise((resolve, reject) => {
    db.run(
      'CREATE TABLE IF NOT EXISTS documents (' +
      'collection TEXT, ' +
      'id TEXT, ' +
      'data TEXT, ' +
      'PRIMARY KEY (collection, id))',
      (err) => {
        if (err) return reject(err)

        console.log('DB SQLite was created from file', filename)
        resolve(db)
      }
    )
  })
}

async function loadDataToMingo (db, mingo) {
  return new Promise((resolve, reject) => {
    db.all('SELECT collection, id, data FROM documents', [], (err, rows) => {
      if (err) return reject(err)

      for (const row of rows) {
        if (!mingo.docs[row.collection]) {
          mingo.docs[row.collection] = {}
        }
        mingo.docs[row.collection][row.id] = JSON.parse(row.data)
      }
      resolve()
      console.log('DB data was loaded from SQLite to shareDbMingo')
    })
  })
}

async function cloneSqlDb (source, target) {
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

// override the commit method to save changes to SQLite
function patchMingoCommit (sqlite, shareDbMingo) {
  const originalCommit = shareDbMingo.commit

  shareDbMingo.commit = function (collection, docId, op, snapshot, options, callback) {
    originalCommit.call(this, collection, docId, op, snapshot, options, (err) => {
      if (err) return callback(err)

      sqlite.run(
        'REPLACE INTO documents (collection, id, data) VALUES (?, ?, ?)',
        [collection, docId, JSON.stringify(snapshot)],
        (err) => {
          if (err) {
            console.error(err.message)
            return callback(err)
          }

          console.log(`Document with id ${docId} saved to SQLite`)
          callback()
        }
      )
    })
  }
}

export { createSqlDb, loadDataToMingo, cloneSqlDb, patchMingoCommit }
