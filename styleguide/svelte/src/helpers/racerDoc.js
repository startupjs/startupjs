import model from '@startupjs/model'

export default function racerDoc (collectionName, docId) {
  if (!collectionName) return Error('collectionName')
  if (!docId) return

  const scope$ = model.scope(`${collectionName}.${docId}`)

  scope$.subscribe = setter => {
    model.subscribe(scope$, () => {
      setter(scope$.get())
      scope$.onSubscribe && scope$.onSubscribe()
    })

    scope$.on('all', '**', eventName => {
      if (eventName === 'load') return
      setter(scope$.get())
    })

    return () => model.unsubscribe(scope$)
  }

  return scope$
}
