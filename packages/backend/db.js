import ShareDbMongo from 'sharedb-mongo'

const { MONGO_URL, NO_MONGO, DB_READONLY } = process.env

let db
let mongo
let mongoClient
let createMongoIndex = () => {}

// use mongo
if (MONGO_URL && !NO_MONGO) {
  console.log('Database: mongo')
  const mongoDb = await import('./mongo.js')

  db = ShareDbMongo(
    {
      mongo: callback => callback(null, mongoDb.mongoClient),
      allowAllQueries: true
    }
  )
  mongo = mongoDb.mongo
  mongoClient = mongoDb.mongoClient
  createMongoIndex = mongoDb.createMongoIndex
// use mingo without persist data
} else if (DB_READONLY) {
  console.log('Database: mingo')
  db = await import('./mingo.js').default
// all other cases use mingo with sqlite persist
} else {
  console.log('Database: mingo persistance sqlite')
  db = await import('./mingo-sqlite.js').default
}

export default db

export {
  mongo,
  mongoClient,
  createMongoIndex
}
