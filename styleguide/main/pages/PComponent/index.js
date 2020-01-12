import React, { useState } from 'react'
import { observer } from 'startupjs'
// import { Props } from 'components'
import { Progress } from '@startupjs/ui'
import { View, Text, TouchableOpacity } from 'react-native'
import propTypes from 'prop-types'
import './index.styl'

export default observer(function PComponent () {
  let [kek, kekUp] = useState(0.5344343)
  console.log(kek)
  return pug`
    View(style={width: 300})
      Progress(value=kek label='Loading' total=100)
      TouchableOpacity(onPress=()=>kekUp(kek + 0.5))
        Text(style={marginTop: 20}) UP
  `
})

function RenderText ({ value }) {
  return pug`
    Text= value
  `
}

RenderText.propTypes = {
  value: propTypes.string
}
