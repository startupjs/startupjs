import model from '@startupjs/model'

export default function racerQuery (collectionName, options) {
  const scope$ = model.scope(collectionName)
  const query$ = model.query(collectionName, options)

  scope$.subscribe = setter => {
    query$.subscribe(() => {
      setter(query$.get())

      // event change docs
      const docIds = query$.getIds()
      for (const docId of docIds) {
        const doc$ = model.root.connection.get(collectionName, docId)
        doc$.on('op', () => setter(query$.get()))
      }

      // event insert docs
      query$.shareQuery.on('insert', docs => {
        setter(query$.get())

        docs.forEach(doc$ => {
          doc$.on('op', () => setter(query$.get()))
        })
      })

      // event remove docs
      query$.shareQuery.on('remove', () => {
        console.log('remove')
        setter(query$.get())
      })
    })

    return () => query$.unsubscribe()
  }

  scope$.set = data => {
    data.forEach(item => {
      model.scope(`${collectionName}.${item.id}`).setDiff({ ...item })
    })
  }

  return scope$
}
