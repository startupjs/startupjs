import { emit, useLocal } from 'startupjs'

export default function useDocName () {
  let [docName] = useLocal('$render.match.params.docName')
  const setDocName = (name) => {
    emit('url', `/docs/${name}`)
  }
  return [docName, setDocName]
}
