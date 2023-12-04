import ShareDbMongo from 'sharedb-mongo'
import ShareDbMingoMemory from 'sharedb-mingo-memory'
import sqlite3 from 'sqlite3'
import { mongoClient } from './mongo.js'

const { MONGO_URL, NO_MONGO, DB_PATH, DB_LOAD_SNAPSHOT } = process.env

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
      console.log('Documents loaded from SQLite to shareDbMingo')
    })
  })
}

async function cloneSqlDb (source, target) {
  return new Promise((resolve, reject) => {
    source.serialize(() => {
      source.all('SELECT * FROM tableName', [], (err, rows) => {
        if (err) return reject(err)

        // Insert data into target database
        rows.forEach((row) => {
          target.run('INSERT INTO tableName (column1, column2) VALUES (?, ?)', [row.column1, row.column2], (err) => {
            if (err) return reject(err)

            console.log('Documents cloned into SQLite database')
          })
        })
      })
    })
  })
}

// override the commit method to save changes to SQLite
async function patchMingoCommit (sqlDb, shareDbMingo) {
  const originalCommit = shareDbMingo.commit

  shareDbMingo.commit = function (collection, docId, op, snapshot, options, callback) {
    originalCommit.call(this, collection, docId, op, snapshot, options, (err) => {
      if (err) return callback(err)

      sqlDb.run(
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

async function initDb () {
  console.log(DB_PATH, DB_LOAD_SNAPSHOT, MONGO_URL, NO_MONGO)

  if (MONGO_URL && !NO_MONGO) {
    return ShareDbMongo(
      {
        mongo: callback => callback(null, mongoClient),
        allowAllQueries: true
      }
    )
  }

  console.log(1)

  const shareDbMingo = new ShareDbMingoMemory()

  if (DB_PATH === '' && !DB_LOAD_SNAPSHOT) return shareDbMingo

  console.log(2)
  const sourcePath = DB_LOAD_SNAPSHOT || DB_PATH || 'sqlite.db'
  let sqlDb = await createSqlDb(sourcePath)
  console.log(3, sqlDb)
  await loadDataToMingo(sqlDb, shareDbMingo)
  console.log(4)
  // create new db base on snapshot
  if (DB_PATH !== '' && DB_LOAD_SNAPSHOT) {
    const sourceDb = sqlDb
    console.log(5)
    sqlDb = await createSqlDb(DB_PATH || 'sqlite.db')
    console.log(6)
    await cloneSqlDb(sourceDb, sqlDb)
  }

  console.log(7)
  await patchMingoCommit(sqlDb, shareDbMingo)

  return shareDbMingo
}

const db = await initDb()

console.log(db, 'WTF!!!!!!!!!!!!')

export default db
