import React from 'react'
import { observer, useModel } from 'startupjs'
import { Input, Collapse } from '@startupjs/ui'
import {
  useShowGrid,
  useShowSizes,
  useValidateWidth,
  useDarkTheme
} from 'clientHelpers'
import './index.styl'

export default observer(function Options ({
  style
}) {
  const $open = useModel('_session.sidebarOptions')
  const [, $showGrid] = useShowGrid()
  const [, $showSizes] = useShowSizes()
  const [, $validateWidth] = useValidateWidth()
  const [, $darkTheme] = useDarkTheme()

  return pug`
    Collapse(
      title='Options'
      $open=$open
    )
      Input(type='checkbox' label='Dark theme' $value=$darkTheme)
      Input(type='checkbox' label='Show sizes' $value=$showSizes)
      if $showSizes.get()
        Input(type='checkbox' label='Validate width' $value=$validateWidth)
        Input(type='checkbox' label='Show grid' $value=$showGrid)
  `
})
