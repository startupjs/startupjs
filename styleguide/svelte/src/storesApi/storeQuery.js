import model from '@startupjs/model'
import { writable } from 'svelte/store'
import stores from './stores'

export default function storeQuery (collectionName, options) {
  // add options in path ?
  const storePath = '_sharedb.' + collectionName
  let store = stores[storePath]
  let query

  if (!store) {
    store = writable([])

    query = model.root.connection.createSubscribeQuery(collectionName, options)

    query.on('ready', () => {
      store.set(query.results.map(doc => getDocData(doc)))

      query.results.forEach(doc => {
        doc.on('op', () => {
          store.set(query.results.map(doc => getDocData(doc)))
        })
      })
    })

    query.on('insert', docs => {
      store.update(storeData => {
        const docsData = docs.map(doc => {
          doc.on('op', () => {
            store.set(query.results.map(doc => getDocData(doc)))
          })
          return getDocData(doc)
        })

        return [...storeData, ...docsData]
      })
    })

    query.on('remove', docs => {
      store.update(storeData => {
        docs.forEach(doc => {
          const docDelIndex = storeData.findIndex(item => item.id === doc.id)
          storeData.splice(docDelIndex, 1)
        })
        return storeData
      })
    })
  }

  return {
    subscribe: store.subscribe,
    set: data => {
      data.forEach(item => {
        model.scope(`${collectionName}.${item.id}`).setDiff(item)
      })
    },
    add: data => model.scope(collectionName).add(data),
    reset: () => {
      store.set([])
      query.destroy()
    }
  }
}

function getDocData (doc) {
  const data = { ...doc.data }

  Object.defineProperties(data, {
    del: {
      value: function () {
        model.scope(`${doc.collection}.${doc.id}`).del()
      },
      writable: false
    },
    set: {
      value: data => {
        console.log(data)
        model.scope(`${doc.collection}.${doc.id}`).setDiff(data)
      },
      writable: false
    }
  })

  return data
}
