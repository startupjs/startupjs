import { self } from 'react-native-threads'
import MessageStream from 'sharedb-offline/lib/MessageStream'
import Messenger from 'sharedb-offline/lib/Messenger'
import RPC from 'sharedb-offline/lib/RPC'
import workerRpc from 'sharedb-offline/lib/workerRpc'
import ShareDB from 'sharedb'
import ShareDBMingo from 'sharedb-mingo'
import NativeStore from '@js-code/native-store'

const { EventEmitter } = require('events')
const db = new ShareDBMingo({
  store: new NativeStore()
})

export const backend = new ShareDB({ db })
export const workerMessenger = new Messenger(self, 'worker')
export const ee = new EventEmitter()

workerMessenger.on('rpc', (rpcMessenger) => {
  const {
    syncWorkerBrowser,
    syncBrowserWorker,
    getDocumentsVersions,
    deleteDocuments,
    updateDocuments,
    updateDocumentsFull
  } = workerRpc(db)
  const rpc = new RPC(rpcMessenger)
  ee.emit('rpc', rpc)

  rpc.registerHandler('syncWorkerBrowser', syncWorkerBrowser)
  rpc.registerHandler('syncBrowserWorker', syncBrowserWorker)
  rpc.registerHandler('getDocumentsVersions', getDocumentsVersions)
  rpc.registerHandler('deleteDocuments', deleteDocuments)
  rpc.registerHandler('updateDocuments', updateDocuments)
  rpc.registerHandler('updateDocumentsFull', updateDocumentsFull)
})

workerMessenger.on('sharedb', (sharedbMessenger) => {
  const stream = new MessageStream(sharedbMessenger)
  backend.listen(stream)
})

export default () => {}
