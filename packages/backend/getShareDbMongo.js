const ShareDbMongo = require('sharedb-mongo')
const MongoClient = require('mongodb').MongoClient
const fs = require('fs')
const isString = require('lodash/isString')
const {
  MONGO_URL,
  MONGO_OPTS,
  MONGO_SSL_KEY_PATH,
  MONGO_SSL_CERT_PATH,
  MONGO_SSL_CA_PATH,
  NO_MONGO
} = process.env

let initPromise
let shareDbMongo

module.exports = async function getShareDbMongo (options = {}) {
  if (shareDbMongo) return shareDbMongo
  if (initPromise) return initPromise

  initPromise = new Promise((resolve, reject) => {
    if (MONGO_URL && !NO_MONGO) {
      let mongoOptions = { useUnifiedTopology: true, ...options }
      let mongoOpts = isString(MONGO_OPTS)
        ? JSON.parse(MONGO_OPTS)
        : undefined

      if (mongoOpts) {
        if (mongoOpts.key) {
          mongoOptions.sslKey = fs.readFileSync(mongoOpts.key)
          mongoOptions.sslCert = fs.readFileSync(mongoOpts.cert)
          mongoOptions.sslCA = fs.readFileSync(mongoOpts.ca)
        }
      } else if (MONGO_SSL_KEY_PATH) {
        mongoOptions.sslKey = fs.readFileSync(MONGO_SSL_KEY_PATH)
        mongoOptions.sslCert = fs.readFileSync(MONGO_SSL_CERT_PATH)
        mongoOptions.sslCA = fs.readFileSync(MONGO_SSL_CA_PATH)
      }

      shareDbMongo = ShareDbMongo({
        mongo: (callback) => {
          MongoClient.connect(
            MONGO_URL,
            mongoOptions,
            (err, db) => {
              callback(err, db)
              resolve(shareDbMongo)
            }
          )
        },
        allowAllQueries: true
      })
    } else {
      // then use sharedb-mingo-memory which dumps into an SQLite
      // for persistent data storage
      getShareDbMingo()
        .then(shareDbMingo => {
          shareDbMongo = shareDbMingo
          resolve(shareDbMongo)
        })
        .catch(reject)
    }
  })

  return initPromise
}

async function getShareDbMingo () {
  const ShareDbMingoMemory = require('sharedb-mingo-memory')
  const sqlite3 = require('sqlite3')
  const db = new sqlite3.Database('sqlite.db')
  const shareDbMingo = new ShareDbMingoMemory()

  return new Promise((resolve, reject) => {
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

            console.log('commit 3')
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
