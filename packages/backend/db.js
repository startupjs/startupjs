import ShareDbMongo from 'sharedb-mongo'
import ShareDbMingoMemory from 'sharedb-mingo-memory'
import sqlite3 from 'sqlite3'
import { mongoClient } from './mongo.js'

const { MONGO_URL, NO_MONGO } = process.env

let db

if (MONGO_URL && !NO_MONGO) {
  db = ShareDbMongo(
    {
      mongo: callback => callback(null, mongoClient),
      allowAllQueries: true
    }
  )
} else {
  db = await new Promise((resolve, reject) => {
    const db = new sqlite3.Database('sqlite.db')
    const shareDbMingo = new ShareDbMingoMemory()

    db.run(
      'CREATE TABLE IF NOT EXISTS documents (' +
      'collection TEXT, ' +
      'id TEXT, ' +
      'data TEXT, ' +
      'PRIMARY KEY (collection, id))',
      (err) => {
        if (err) return reject(err)

        // Load data from SQLite
        db.all('SELECT collection, id, data FROM documents', [], (err, rows) => {
          if (err) return reject(err)

          for (const row of rows) {
            if (!shareDbMingo.docs[row.collection]) {
              shareDbMingo.docs[row.collection] = {}
            }
            shareDbMingo.docs[row.collection][row.id] = JSON.parse(row.data)
          }

          console.log('Documents loaded from SQLite to shareDbMingo')
        })

        // override the commit method to save changes to SQLite
        const originalCommit = shareDbMingo.commit

        shareDbMingo.commit = function (collection, docId, op, snapshot, options, callback) {
          originalCommit.call(this, collection, docId, op, snapshot, options, (err) => {
            if (err) return callback(err)

            db.run(
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

        resolve(shareDbMingo)
      }
    )
  })
}

export default db
