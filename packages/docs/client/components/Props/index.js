import React, { useMemo, useState } from 'react'
import { observer, $root, useComponentId } from 'startupjs'
import { View, ScrollView } from 'react-native'
import './index.styl'
import Constructor from './Constructor'
import Renderer from './Renderer'
import { themed, Button, Row } from '@startupjs/ui'

export default observer(themed(function PComponent ({
  Component,
  $props,
  componentName,
  showGrid,
  style,
  validateWidth,
  showSizes,
  theme,
  block: defaultBlock
}) {
  const [block, setBlock] = useState(!!defaultBlock)
  const componentId = useComponentId()
  const $theProps = useMemo(() => {
    if (!$props) {
      return $root.scope(`_session.Props.${componentId}`)
    } else {
      return $props
    }
  }, [$props])
  $theProps.setNull('', {})

  return pug`
    View.root(style=style)
      ScrollView.top(styleName=[theme])
        Constructor(Component=Component $props=$theProps)
      ScrollView.bottom(
        styleName=[theme, { showSizes }]
      )
        Renderer(
          Component=Component
          props=$theProps.get()
          showGrid=showGrid
          validateWidth=validateWidth
          showSizes=showSizes
          block=block
        )
        Row(align='right').display
          Button(
            size='s'
            variant='text'
            color=block ? undefined : 'primary'
            onPress=() => setBlock(false)
          ) inline
          Button(
            size='s'
            variant='text'
            color=block ? 'primary' : undefined
            onPress=() => setBlock(true)
          ) block
  `
}))
