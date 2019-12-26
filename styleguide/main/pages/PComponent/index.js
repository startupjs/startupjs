import React from 'react'
import { observer, useSession } from 'startupjs'
import { Props } from 'components'
import { View, Text, Button } from 'react-native'
import propTypes from 'prop-types'
import { SmartSidebar } from '../../../../packages/ui/'
import Layout from '../../../../packages/ui/components/Layout'
import './index.styl'

export default observer(function PComponent () {
  // Remove
  const [isOpen, $isOpen] = useSession('Sidebar.isOpen')
  return pug`
    Layout
      SmartSidebar
        Button(title='test' onPress=() => $isOpen.set(!isOpen))
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
