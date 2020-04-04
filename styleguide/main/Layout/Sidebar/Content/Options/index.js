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
  // TODO: figure out why getting showSizes here leads to a bug of being non-reactive
  //       initially. While $showSizes.get() works fine for some reason.
  const [, $showSizes] = useShowSizes()
  const [, $validateWidth] = useValidateWidth()
  const [, $darkTheme] = useDarkTheme()

  return pug`
    Collapse($open=$open variant='pure')
      Collapse.Header.header Options
      Collapse.Content.content
        Input(type='checkbox' label='Dark theme' $value=$darkTheme)
        Input(type='checkbox' label='Show sizes' $value=$showSizes)
        if $showSizes.get()
          Input(type='checkbox' label='Validate width' $value=$validateWidth)
          Input(type='checkbox' label='Show grid' $value=$showGrid)
  `
})
