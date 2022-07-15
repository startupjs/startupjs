import React, { useState, useRef } from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import AbstractPopover from './../AbstractPopover'
import { stringifyValue, getOptionLabel, getOptionValue } from './../forms/Rank/helpers'
import Div from './../Div'
import Item from './../Item'
import './index.styl'

function Dropdown ({
  style,
  attachmentStyle,
  value,
  options,
  children,
  renderItem,
  onChange,
  ...props
}, ref) {
  const anchorRef = useRef()
  const [visible, onChangeVisible] = useState(false)

  function renderWrapper (children) {
    return pug`
      Div.root
        Div.overlay(feedback=false onPress=() => onChangeVisible(false))
        = children
    `
  }

  function renderContent () {
    const items = options.map((option, index) => {
      return {
        option,
        index,
        states: {
          selected: stringifyValue(option.value) === stringifyValue(value)
        }
      }
    })
    return pug`
      Div.items
        each item in items
          = renderItem(item)
    `
  }

  if (!renderItem) {
    renderItem = ({ option, states: { selected } }) => {
      return pug`
        Item.item(
          styleName={ selected }
          onPress=() => onChange(getOptionValue(option.value))
        )= getOptionLabel(option)
      `
    }
  }

  return pug`
    Div(
      style=style
      ref=anchorRef
      onPress=() => onChangeVisible(true)
    )= children
    AbstractPopover.attachment(
      ...props
      visible=visible
      style=[attachmentStyle]
      anchorRef=anchorRef
      renderWrapper=renderWrapper
    )= renderContent && renderContent()
  `
}

Dropdown.defaultProps = {
  ...AbstractPopover.defaultProps,
  options: []
}

Dropdown.propTypes = {
  attachmentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  ...AbstractPopover.propTypes,
  $visible: PropTypes.any,

  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ])
  ),
  renderItem: PropTypes.func,
  onChange: PropTypes.func
}

export default observer(Dropdown, { forwardRef: true })
