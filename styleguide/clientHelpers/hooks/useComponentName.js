import { emit, useLocal } from 'startupjs'

export default function useComponentName () {
  const [componentName] = useLocal('$render.match.params.componentName')
  console.log('>> componentName', componentName)
  return [componentName, setComponentName]
}

function setComponentName (name) {
  emit('url', `/sandbox/${name}`)
}
