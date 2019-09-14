import racer from 'racer'
import racerRpc from 'racer-rpc'
import fs from 'fs'
const FIXTURES_PATH = __dirname + '/../fixtures'

// RPC support
racer.use(racerRpc)

export default function (backend) {
  // Warning: this model is never destroyed.
  // We'll subscribe to everything for the ease of use, so we want the updates
  // to be flowing through subscribes
  let model = backend.createModel({ fetchOnly: false })
  let collections = getAllCollectionNames()
  model.subscribe(collections.map(name => model.query(name, {})))
  backend.rpc.on('model', function (...args) {
    let [method, ...params] = args
    model[method](...params)
  })
}

function getAllCollectionNames () {
  let files = fs.readdirSync(FIXTURES_PATH)
  let collections = []
  for (let file of files) {
    if (!/\.ya?ml$/.test(file)) continue
    collections.push(file.replace(/\.ya?ml$/, ''))
  }
  return collections
}
