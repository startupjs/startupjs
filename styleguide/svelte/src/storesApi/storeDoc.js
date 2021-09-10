import { writable } from 'svelte/store'
import stores from './stores'

export default function storeDoc (collectionName, docId) {
  const storePath = `_sharedb.${collectionName}.${docId}`
  let store = stores[storePath]

  if (!store) {
    store = writable({})
    // doc
  }

  return {
    subscribe: store.subscribe
  }
}
