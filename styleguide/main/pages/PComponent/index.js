import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Props } from 'components'
import { View, Text } from 'react-native'
import propTypes from 'prop-types'
import { SmartSidebar, Div } from 'ui'
import './index.styl'

export default observer(function PComponent () {
  const [open, setOpen] = useState()
  function renderContent () {
    return pug`
      Div(onPress=() => setOpen(!open))
        Text ToggleSidebar
    `
  }
  return pug`
    SmartSidebar(renderContent=renderContent open=open)
      Div.div(onPress=() => setOpen(!open) shadow='m')
        Text ToggleSidebar
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
