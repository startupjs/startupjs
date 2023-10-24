import React, { useState } from 'react'
import { pug, observer, useValue } from 'startupjs'
import { Br, Input, Button, Modal, Span, CssVariables } from '@startupjs/ui'
import { faSlidersH } from '@fortawesome/free-solid-svg-icons'
import {
  useShowGrid,
  useShowSizes,
  // useValidateWidth,
  useDarkTheme
} from '../../../../../clientHelpers'
import './index.styl'

export default observer(function Options ({
  style
}) {
  const [, $open] = useValue(false)
  const [, $showGrid] = useShowGrid()
  // TODO: figure out why getting showSizes here leads to a bug of being non-reactive
  //       initially. While $showSizes.get() works fine for some reason.
  const [, $showSizes] = useShowSizes()
  // const [, $validateWidth] = useValidateWidth()
  const [, $darkTheme] = useDarkTheme()
  const [theme, setTheme] = useState(0)

  return pug`
    if theme !== 0
      CssVariables(variables=THEMES[theme])
    Button(
      style=style
      icon=faSlidersH
      color='darkLight'
      variant='text'
      onPress=() => $open.set(true)
    )
    Modal(
      title='Settings'
      $visible=$open
    )
      Input.input(type='checkbox' label='Dark theme' $value=$darkTheme)
      if $showSizes.get()
        //- TODO: Maybe bring width check back in future
        // Input.input(type='checkbox' label='Validate width' $value=$validateWidth)
        Input.input(type='checkbox' label='Show grid' $value=$showGrid)
      Input.input(type='checkbox' label='Show sizes' $value=$showSizes)
      Br
      Button(onPress=() => setTheme((theme + 1) % THEMES.length)) Toggle Theme
      Br(half)
      Span Theme: #{JSON.stringify(THEMES[theme]) || '- no overrides -'}
      Br(half)
  `
})

const THEMES = [
  undefined,
  {
    '--color-text-primary': '#f00',
    '--color-primary-inverse': '#faa'
  },
  {
    '--color-text-primary': '#0f0',
    '--color-primary-inverse': '#afa'
  },
  {
    '--color-text-primary': '#00f',
    '--color-primary-inverse': '#aaf'
  }
]
