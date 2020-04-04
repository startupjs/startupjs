import { useParams } from 'startupjs/app'
import { emit, $root } from 'startupjs'

export default function useDocName () {
  const { docName } = useParams()
  return [docName, setDocName]
}

function setDocName (name) {
  const lang = $root.get('$render.params.lang')
  emit('url', `/${lang}/docs/${name}`)
}
