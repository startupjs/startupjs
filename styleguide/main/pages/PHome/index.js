import { useEffect } from 'react'
import { observer, emit } from 'startupjs'
import docs from '@startupjs/ui/docs'

export default observer(function PHome ({
  style
}) {
  useEffect(() => {
    emit('url', '/sandbox/' + Object.keys(docs)[0])
  }, [])
  return null
})
