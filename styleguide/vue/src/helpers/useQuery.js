import model from '@startupjs/model'
import { ref, onUnmounted } from 'vue'

export default function useQuery (collectionName, options) {
  const $query = model.query(collectionName, options)
  const $scope = model.scope(collectionName)

  const result = ref(null)
  function setter (data) {
    result.value = injectScope([...data], $scope)
  }

  $query.subscribe(() => {
    setter($query.get())

    // event change docs
    const docIds = $query.getIds()
    for (const docId of docIds) {
      const $doc = model.root.connection.get(collectionName, docId)
      $doc.on('op', () => setter($query.get()))
    }

    // event insert docs
    $query.shareQuery.on('insert', docs => {
      setter($query.get())

      docs.forEach($doc => {
        $doc.on('op', () => setter($query.get()))
      })
    })

    // event remove docs
    $query.shareQuery.on('remove', () => {
      setter($query.get())
    })
  })

  onUnmounted(() => {
    $query.unsubscribe()
    // removeListeners
  })

  return result
}

function injectScope (data, $scope) {
  if (!data.$) {
    Object.defineProperty(data, '$', {
      get: () => $scope,
      set: () => {}
    })
  }

  data.forEach(item => {
    if (item.$) return
    Object.defineProperty(item, '$', {
      get: () => $scope.at(item.id),
      set: () => {}
    })
  })

  return data
}
