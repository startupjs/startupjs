export const {
  db,
  mongo, // (optional, only if mongo is used) mongoClient.db()
  mongoClient, // (optional, only if mongo is used)
  createMongoIndex = () => {}, // (optional, only if mongo is used; mock provided) create mongo indexes
  sqlite // (optional, only if mingo-sqlite is used) sqlite3 db instance
} = await getDb({
  mongoUrl: process.env.MONGO_URL,
  disableMongo: process.env.NO_MONGO,
  isReadonly: process.env.DB_READONLY
})

async function getDb ({ mongoUrl, disableMongo, isReadonly }) {
  if (mongoUrl && !disableMongo) {
    console.log('Database: mongo')
    return await import('./mongo.js')
  } else if (isReadonly) {
    console.log('Database: mingo-memory (no data persistency)')
    return await import('./mingo-memory.js')
  } else {
    console.log('Database: mingo-sqlite (persist data to a local SQLite file)')
    return await import('./mingo-sqlite.js')
  }
}
