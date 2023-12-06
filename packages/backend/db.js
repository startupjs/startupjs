const { MONGO_URL, NO_MONGO, DB_PATH } = process.env

let db

// use mongo
if (MONGO_URL && !NO_MONGO) {
  console.log('Use Mongo')
  db = await import('./mongo.js').default
// use mingo without persist data
} else if (DB_PATH === '') {
  console.log('Use Mingo')
  db = await import('./mingo.js').default
// all other cases use mingo with sqlite persist
} else {
  console.log('Use Mingo with persist')
  db = await import('./mingo-persist.js').default
}

export default db
