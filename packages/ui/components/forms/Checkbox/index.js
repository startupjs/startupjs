import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { useLayout } from './../../../hooks'
import Row from './../../Row'
import Div from './../../Div'
import Span from './../../typography/Span'
import CheckboxInput from './checkbox'
import SwitchInput from './switch'
import themed from '../../theming/themed'
import './index.styl'

const INPUT_COMPONENTS = {
  checkbox: CheckboxInput,
  switch: SwitchInput
}

const READONLY_ICONS = {
  TRUE: '✓',
  FALSE: '✗'
}

function Checkbox ({
  style,
  className,
  variant,
  label,
  value,
  layout,
  icon,
  disabled,
  readonly,
  onChange,
  hoverStyle,
  activeStyle,
  ...props
}) {
  const _layout = useLayout(layout, label)
  const pure = _layout === 'pure'

  function onPress () {
    onChange && onChange(!value)
  }

  function renderInput (standalone) {
    const Input = INPUT_COMPONENTS[variant]

    if (readonly) {
      return pug`
        Row.checkbox-icon-wrap(
          styleName=[variant]
        )
          Span.checkbox-icon(
            styleName={readonly}
          )=value ? READONLY_ICONS.TRUE : READONLY_ICONS.FALSE
      `
    }

    return pug`
      Input(
        style=standalone ? style : {}
        className=standalone ? className : undefined
        value=value
        icon=icon
        disabled=disabled
        onPress=standalone ? onPress : undefined /* fix double opacity on input element for rows variant */
        hoverStyle=standalone ? hoverStyle : undefined
        activeStyle=standalone ? activeStyle : undefined
        ...props
      )
    `
  }

  if (pure) return renderInput(true)

  return pug`
    Row.root(
      style=style
      className=className
      vAlign='center'
      disabled=disabled
      onPress=!readonly ? onPress : undefined
      hoverStyle=hoverStyle
      activeStyle=activeStyle
    )
      = renderInput()
      Div.label
        if typeof label === 'string'
          Span= label
        else
          = label
  `
}

Checkbox.defaultProps = {
  variant: 'checkbox',
  value: false,
  disabled: false,
  readonly: false
}

Checkbox.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  variant: PropTypes.oneOf(['checkbox', 'switch']),
  label: PropTypes.node,
  value: PropTypes.bool,
  layout: PropTypes.oneOf(['pure', 'rows']),
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func
}

export default observer(themed(Checkbox))
