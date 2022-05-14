import model from '@startupjs/model'
import { ref, onUnmounted } from 'vue'

export default function useDoc (collectionName, docId) {
  if (!collectionName) return Error('collectionName')

  const result = ref(null)
  function setter (data) {
    result.value = injectScope({ ...data }, $scope)
  }

  if (!docId) return result

  const $scope = model.scope(`${collectionName}.${docId}`)
  $scope.subscribe(() => setter($scope.get()))
  $scope.on('all', '**', eventName => {
    if (eventName === 'load') return
    setter($scope.get())
  })

  onUnmounted(() => {
    $scope.unsubscribe()
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

  return data
}
