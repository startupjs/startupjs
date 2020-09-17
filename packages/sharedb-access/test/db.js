import mongoPkg from 'mongodb'
import promisifyRacer from '@startupjs/orm/lib/promisifyRacer.js'
import racer from 'racer'
import shareDbMongo from 'sharedb-mongo'

const { MongoClient } = mongoPkg
const { Model } = racer

promisifyRacer()


export const getDbs = () => {
  let mongoUrl = 'mongodb://localhost:27017/accessTest'
  let mongoOpts = []

  let shareMongo = shareDbMongo(mongoUrl, {
      allowAllQueries: true,
      mongoOptions: { useUnifiedTopology: true }
    })

  let backend = racer.createBackend({ db: shareMongo })

  return { backend, shareMongo }
}
