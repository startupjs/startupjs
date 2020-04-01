import React from 'react'
import { observer } from 'startupjs'
import { Text } from 'react-native'
import docs from '@startupjs/ui/docs'
import { useDocName } from 'clientHelpers'

export default observer(function PDoc ({
  style
}) {
  const [docName] = useDocName()
  const Component = docs[docName]
  if (!Component) return pug`Text 404. Not found`

  return pug`
    Component
  `
})
