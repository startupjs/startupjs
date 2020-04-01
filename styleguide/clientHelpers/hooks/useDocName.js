import { useParams } from 'startupjs/app'
import { emit } from 'startupjs'

export default function useDocName () {
  const { docName } = useParams()
  return [docName, setDocName]
}

function setDocName (name) {
  emit('url', `/docs/${name}`)
}
