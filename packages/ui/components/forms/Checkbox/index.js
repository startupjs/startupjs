import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { useLayout } from './../../../hooks'
import Row from './../../Row'
import Div from './../../Div'
import Span from './../../typography/Span'
import CheckboxInput from './checkbox'
import SwitchInput from './switch'
import themed from '../../../theming/themed'
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
  description,
  layout,
  value,
  icon,
  disabled,
  readonly,
  onChange,
  hoverStyle,
  activeStyle,
  ...props
}) {
  layout = useLayout({ layout, label, description })

  const pure = layout === 'pure'

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
    Div.root(
      style=style
      className=className
      disabled=disabled
      onPress=!readonly ? onPress : undefined
      hoverStyle=hoverStyle
      activeStyle=activeStyle
    )
      Row(vAlign='center')
        = renderInput()
        if label
          Span.label(bold)= label
      if description
        Span.description(description)= description
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
  label: PropTypes.string,
  description: PropTypes.string,
  layout: PropTypes.oneOf(['pure', 'rows']),
  value: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func
}

export default observer(themed(Checkbox))
