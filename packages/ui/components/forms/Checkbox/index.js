import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Row from './../../Row'
import Div from './../../Div'
import Span from './../../typography/Span'
import Checkbox from './checkbox'
import Switch from './switch'
import { useLayout } from './../../../hooks'
import './index.styl'

const INPUT_COMPONENTS = {
  checkbox: Checkbox,
  switch: Switch
}

function CheckboxInput ({
  style,
  className,
  variant,
  label,
  value,
  layout,
  disabled,
  onChange,
  ...props
}) {
  const _layout = useLayout(layout, label)
  const pure = _layout === 'pure'

  function onPress () {
    onChange && onChange(!value)
  }

  function renderInput (standalone) {
    const Input = INPUT_COMPONENTS[variant]
    return pug`
      Input(
        style=standalone ? style : {}
        className=standalone ? className : undefined
        value=value
        disabled=disabled
        onPress=standalone ? onPress : null /* fix double opacity on input element for rows variant */
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
      onPress=onPress
    )
      = renderInput()
      Div.label
        if typeof label === 'string'
          Span= label
        else
          = label
  `
}

CheckboxInput.defaultProps = {
  variant: 'checkbox',
  value: false,
  disabled: false
}

CheckboxInput.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  variant: propTypes.oneOf(['checkbox', 'switch']),
  label: propTypes.node,
  value: propTypes.bool,
  layout: propTypes.oneOf(['pure', 'rows']),
  disabled: propTypes.bool,
  onChange: propTypes.func
}

export default observer(CheckboxInput)
