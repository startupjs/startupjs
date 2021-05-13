import React from 'react'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Row from '../Row'
import Div from '../Div'
import Span from '../typography/Span'
import Icon from '../Icon'
import './index.styl'

export default function MultiSelect ({
  value
}) {
  function renderTags () {
    return pug`
      Row.tagList
        each item in value
          Row.tag
            Span= item.label
            Div
              Icon.tagIcon(icon=faTimes)
    `
  }

  return pug`
    Row
      = renderTags()
  `
}
