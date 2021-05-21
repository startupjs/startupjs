import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import themed from '../../theming/themed'
import './index.styl'

function ProgressFillerWeb ({ style, value }) {
  return pug`
    View.filler(style=[{width: value + '%'}, style])
  `
}
export default observer(themed(ProgressFillerWeb))
