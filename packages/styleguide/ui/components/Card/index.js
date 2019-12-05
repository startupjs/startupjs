import React from 'react'
import { observer } from 'startupjs'
import { Text } from 'react-native'

export default observer(function Card ({
  style
}) {
  return pug`
    Text Card component
  `
})
