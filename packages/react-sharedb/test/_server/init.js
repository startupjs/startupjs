import 'babel-register'
import http from 'http'
import express from 'express'
import racer, { Model } from 'racer'
import shareDbMongo from 'sharedb-mongo'
import racerHighway from 'racer-highway'
import { exec } from 'child_process'
import yaml from 'js-yaml'
import fs from 'fs'
import { promisifyAll } from 'bluebird'
import initRpc from './initRpc'

const MONGO_DB = process.env.MONGO_DB || 'test_react-sharedb'
const MONGO_URL = 'mongodb://localhost:27017/' + MONGO_DB
const PORT = process.env.PORT || 3000
const FIXTURES_PATH = __dirname + '/../fixtures'

let mongo, backend

// Promisify the default model methods like subscribe, fetch, set, push, etc.
promisifyAll(Model.prototype)

async function initDb () {
  // clear database
  return new Promise(resolve => {
    exec(`mongo ${MONGO_DB} --eval "db.dropDatabase();"`, () => {
      mongo = shareDbMongo(MONGO_URL, { allowAllQueries: true })
      backend = racer.createBackend({ db: mongo })
      resolve()
    })
  })
}

async function populateDbWithFixtures () {
  let model = backend.createModel()
  let files = fs.readdirSync(FIXTURES_PATH)
  for (let file of files) {
    if (!/\.ya?ml$/.test(file)) continue
    let collection = file.replace(/\.ya?ml$/, '')
    let items = yaml.safeLoad(fs.readFileSync(`${FIXTURES_PATH}/${file}`))
    let promises = []
    for (let id in items) {
      promises.push(model.addAsync(collection, { id, ...items[id] }))
    }
    await Promise.all(promises)
  }
  model.destroy()
}

async function initServer () {
  let hwHandlers = racerHighway(
    backend,
    {},
    { timeout: 5000, timeoutIncrement: 8000 }
  )

  // init RPC
  initRpc(backend)

  let expressApp = express()
  expressApp.use(backend.modelMiddleware())
  expressApp.use(hwHandlers.middleware)

  let server = http.createServer(expressApp)
  server.on('upgrade', hwHandlers.upgrade)
  server.listen(PORT, err => {
    if (err) {
      process.send({ type: 'done', err })
      return process.exit(1)
    }
    console.log('◕◕◕ started server ◕◕◕')
    process.send({ type: 'done' })
  })
}

;(async function () {
  await initDb()
  await populateDbWithFixtures()
  await initServer()
})()
