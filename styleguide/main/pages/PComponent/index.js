import React from 'react'
import { observer } from 'startupjs'
import { Props } from 'components'
import { View, Text } from 'react-native'
import propTypes from 'prop-types'
import './index.styl'

export default observer(function PComponent () {
  return pug`
    View.root
      View.left
        Text.text Syntax highlighter
      View.right
        Props(of=RenderText)
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
