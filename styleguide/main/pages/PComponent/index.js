import React from 'react'
import { observer } from 'startupjs'
import { Props } from 'components'
import Shadow from '../../../../packages/ui/components/Shadow'
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
    Shadow.testShadowS
      View(style={height: 100, width: 100, alignItems: 'center', justifyContent: 'center'})
        Text Shadow S
    Shadow.testShadowM(variant='m')
      View(style={height: 100, width: 100, alignItems: 'center', justifyContent: 'center'})
        Text Shadow M
    Shadow.testShadowM(variant='l')
      View(style={height: 100, width: 100, alignItems: 'center', justifyContent: 'center'})
        Text Shadow L
    Shadow.testShadowM(variant='xl')
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
