import React, { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { observer, $root, useComponentId } from 'startupjs'
import './index.styl'
import { themed, Button, Row, Div } from '@startupjs/ui'
import Constructor from './Constructor'
import Renderer from './Renderer'

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
    Div.root(style=style)
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
