import { useParams } from 'startupjs/app'
import { emit, $root } from 'startupjs'

export default function useComponentName () {
  const { componentName } = useParams()
  return [componentName, setComponentName]
}

function setComponentName (name) {
  const lang = $root.get('$render.params.lang')
  emit('url', `/${lang}/sandbox/${name}`)
}
