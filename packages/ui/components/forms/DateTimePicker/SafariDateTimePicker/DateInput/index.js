/* @jsx unstable_createElement */
// eslint-disable-next-line
import { unstable_createElement } from 'react-native-web'
import React from 'react'
import { observer } from 'startupjs'
import '../../index.styl'

export default observer(function DateInput (props) {
  return pug`
    input.root(...props)
  `
})
