import React, { useRef, useImperativeHandle } from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import EXTRA_SCHEMA_TYPES from '../helpers/extraSchemaTypes'
import guessInput from '../helpers/guessInput'
import getInputTestId from '../helpers/getInputTestId'
import { useInputMeta, ALL_INPUTS } from './inputs'
import isForwardRef from './isForwardRef'

function Input ({
  input,
  type,
  ...props
}, ref) {
  input = guessInput(input, type, props)

  const testID = getInputTestId(props)
  const { Component, useProps } = useInputMeta(input)

  if (!Component) {
    throw Error(`
      Input component for '${input}' not found.
      Make sure you have passed it to 'customInputs' in your Form
      or connected it as a plugin in the 'customFormInputs' hook.
    `)
  }

  // ref: https://stackoverflow.com/a/68163315 (why innerRef is needed here)
  const innerRef = useRef(null)

  const componentProps = useProps({ ...props, testID }, innerRef)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, () => innerRef.current, [Component])

  const passRef = isForwardRef(Component) ? { ref: innerRef } : {}

  return pug`
    Component(
      ...passRef
      ...componentProps
    )
  `
}

Input.defaultProps = {
  type: 'text'
}

Input.propTypes = {
  type: PropTypes.oneOf(ALL_INPUTS.concat(EXTRA_SCHEMA_TYPES)),
  value: PropTypes.any,
  $value: PropTypes.any
}

export default observer(Input, { forwardRef: true })
