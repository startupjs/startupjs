import React from 'react'
import { observer } from 'startupjs'
import { Props } from 'components'
import Div from '../../../../packages/ui/components/Div'
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
    Div.testShadowS(onPress=() => null)
      View(style={height: 100, width: 100, alignItems: 'center', justifyContent: 'center'})
        Text No Shadow
    Div.testShadowS(shadowSize='s')
      View(style={height: 100, width: 100, alignItems: 'center', justifyContent: 'center'})
        Text Shadow S
    Div.testShadowM(shadowSize='m')
      View(style={height: 100, width: 100, alignItems: 'center', justifyContent: 'center'})
        Text Shadow M
    Div.testShadowM(shadowSize='l')
      View(style={height: 100, width: 100, alignItems: 'center', justifyContent: 'center'})
        Text Shadow L
    Div.testShadowM(shadowSize='xl')
      View(style={height: 100, width: 100, alignItems: 'center', justifyContent: 'center'})
        Text Shadow XL
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
