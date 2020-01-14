import React from 'react'
import { observer } from 'startupjs'
import { Text } from 'react-native'
import { u } from './../../config/helpers'
import './index.styl'
const LINE_HEIGHT = u(2)

export default observer(({ half, lines = 1 }) => {
  const height = half ? LINE_HEIGHT / 2 : LINE_HEIGHT * lines
  return pug`
    Text.root(style={height})
  `
})
