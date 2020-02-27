import React from 'react'
import { observer } from 'startupjs'
import Div from './../../Div'
import Icon from './../../Icon'
import Span from './../../Span'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { u } from './../../../config/helpers'
import './index.styl'

function CollapseTitle ({
  style,
  children,
  variant,
  onPress
}) {
  const content = React.Children.toArray(children).map(child => {
    const style = { paddingRight: u(5) }

    if (typeof child === 'string') {
      return pug`
        Span(style=style numberOfLines=1)= child
      `
    }
    return React.cloneElement(child, { style })
  })

  return pug`
    Div.title(
      style=style
      styleName=[variant]
      onPress=onPress
      interactive=variant === 'full'
    )
      = content
      Div.icon
        Icon(icon=faCaretDown)
  `
}

export default observer(CollapseTitle)
