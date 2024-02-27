import React, { useRef, useImperativeHandle } from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import { getInputTestId, EXTRA_SCHEMA_TYPES, guessInput } from '../helpers'
import { useInputMeta, ALL_INPUTS } from './inputs'

function Input ({
  input,
  type,
  ...props
}, ref) {
  input = guessInput(input, type, props)

  const inputRef = useRef()
  useImperativeHandle(ref, () => inputRef.current, [])

  const testID = getInputTestId(props)
  const { Component, useProps } = useInputMeta(input)
  const componentProps = useProps({ ...props, testID }, inputRef)

  if (!Component) {
    throw Error(`
      Input component for '${input}' not found.
      Make sure you have passed it to 'extraInputs' in your Form
      or connected it as a plugin in the 'extraFormInputs' hook.
    `)
  }

  return pug`
    Component(
      ref=inputRef
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
