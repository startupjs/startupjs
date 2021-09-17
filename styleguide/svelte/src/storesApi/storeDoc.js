import model from '@startupjs/model'

export default function storeDoc (collectionName, docId) {
  const doc$ = model.scope(`${collectionName}.${docId}`)

  doc$.subscribe = setter => {
    model.subscribe(doc$)

    setter(doc$.get())

    doc$.on('all', () => setter(doc$.get()))

    return () => model.unsubscribe(doc$)
  }

  return doc$
}
