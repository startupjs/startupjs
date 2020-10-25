const { default: promisifyRacer } = require('../temp/promisifyRacer.js')
const racer = require('racer')
const shareDbMongo = require('sharedb-mongo')

promisifyRacer()

const getDbs = () => {
  let mongoUrl = 'mongodb://localhost:27017/accessTest'

  let shareMongo = shareDbMongo(mongoUrl, {
    allowAllQueries: true,
    mongoOptions: { useUnifiedTopology: true }
  })

  let backend = racer.createBackend({ db: shareMongo })

  return { backend, shareMongo }
}

module.exports = {
  getDbs
}
