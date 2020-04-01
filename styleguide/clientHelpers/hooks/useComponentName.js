import { useParams } from 'startupjs/app'
import { emit } from 'startupjs'

export default function useComponentName () {
  const { componentName } = useParams()
  return [componentName, setComponentName]
}

function setComponentName (name) {
  emit('url', `/sandbox/${name}`)
}
