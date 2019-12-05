import React from 'react'
import { observer } from 'startupjs'
import { Text } from 'react-native'

export default observer(function Button ({
  style
}) {
  return pug`
    Text Button component
  `
})
