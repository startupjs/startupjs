import React from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import './index.styl'

export default observer(function ProgressFiller ({ value, shape }) {
  return pug`
    View.filler(
      style={
        borderRadius: shape === 'round' ? 4 : 0,
        width: value + '%'
      }
    )
  `
})
