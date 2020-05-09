import React from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import './index.styl'

export default observer(function ProgressFiller ({ style, value }) {
  return pug`
    View.filler(style=[style, {width: value + '%'}])
  `
})
