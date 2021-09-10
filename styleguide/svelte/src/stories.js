import model from '@startupjs/model'
import { writable } from 'svelte/store'

function createTemp () {
  // subscribe, set, update
  const { subscribe, set } = writable([])

  setTimeout(() => {
    const query = model.root.connection.createSubscribeQuery('temp', {})

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
    reset: () => set({})
  }
}

export const temps = createTemp()
