import React from 'react'
import { View } from 'react-native'
import { pug, observer } from 'startupjs'
import themed from '../../theming/themed'
import './index.styl'

function ProgressFiller ({ style, value }) {
  return pug`
    View.filler(style=[{width: value + '%'}, style])
  `
}
export default observer(themed('Progress', ProgressFiller))
