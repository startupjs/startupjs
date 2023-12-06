const { MONGO_URL, NO_MONGO, DB_PATH } = process.env

let db

// use mongo
if (MONGO_URL && !NO_MONGO) {
  db = await import('./mongo.js')
// use mingo without persist data
} else if (DB_PATH === '') {
  db = await import('./mingo.js')
// all other cases use mingo with sqlite persist
} else {
  db = await import('./mingo-persist.js')
}

export default db
