import model from '@startupjs/model'
import { writable } from 'svelte/store'
import stories from './stores'

export function queryStore (collectionName, options) {
  // add options ?
  const storePath = '_queries.' + collectionName

  if (!stories[storePath]) stories[storePath] = writable([])

  const { subscribe, set } = stories[storePath]

  setTimeout(() => {
    const query = model.root.connection.createSubscribeQuery(collectionName, options)

    query.on('ready', () => {
      set(query.results.map(item => item.data))

      query.results.forEach(doc => {
        doc.on('op', () => {
          set(query.results.map(item => item.data))
        })
      })
    })
  }, 100)

  return {
    subscribe,
    set: data => {
      data.forEach(item => {
        model.scope(`temp.${item.id}`).setDiff({ ...item })
      })
    },
    reset: () => set([])
  }
}
