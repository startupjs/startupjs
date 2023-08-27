import { getConnection } from './connection.js'

export function subscribeToDocument (collectionName, docId) {
  const doc = getConnection().get(collectionName, docId)
  const promise = new Promise((resolve, reject) => {
    doc.subscribe(err => {
      if (err) return reject(err)
      resolve()
    })
  })
  return promise
}

export function unsubscribeFromDocument (collectionName, docId) {
  const doc = getConnection().get(collectionName, docId)
  // doc.unsubscribe()
  doc.destroy() // unsubscribe and garbage collect it
}

export function getShareDoc (collectionName, docId) {
  return getConnection().get(collectionName, docId)
}
