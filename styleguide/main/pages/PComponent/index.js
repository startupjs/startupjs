import React, { useEffect } from 'react'
import { observer, useSession } from 'startupjs'
import { Props } from 'components'
import { View, Text } from 'react-native'
import propTypes from 'prop-types'
import { SmartSidebar, Div } from 'ui'
import './index.styl'

export default observer(function PComponent () {
  const drawerPath = 'drawer'
  const [open, $open] = useSession(drawerPath)

  useEffect(() => {
    console.log(open, '<<<<<<<<<<open')
  }, [!!open])

  function renderContent () {
    return pug`
      Div(onPress=() => $open.set(!open))
        Text ToggleSidebar
    `
  }
  return pug`
    SmartSidebar(renderContent=renderContent path=drawerPath)
      Div.div(onPress=() => $open.set(!open) shadow='m')
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
