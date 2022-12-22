import React, { useRef, useImperativeHandle } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { SCHEMA_TYPE_TO_INPUT } from '../helpers'
import CustomInputsContext, { useCustomInputs } from './CustomInputsContext'
import inputs from './inputs'

function Input ({
  input,
  type,
  Component,
  customInputs,
  ...props
}, ref) {
  input = input || type
  input = SCHEMA_TYPE_TO_INPUT[input] || input

  const inputRef = useRef()
  useImperativeHandle(ref, () => inputRef.current, [])

  const inputDefinition = useInputDefinition(input, customInputs, Component)
  const { Component: TheComponent, useProps } = inputDefinition
  const componentProps = useProps(props, inputRef)

  const render = pug`
    TheComponent(
      ref=inputRef
      ...componentProps
    )
  `

  if (customInputs) {
    return pug`
      CustomInputsContext.Provider(value=customInputs)
        = render
    `
  } else {
    return render
  }
}

function useInputDefinition (input, customInputs, Component) {
  const contextCustomInputs = useCustomInputs() || {}
  customInputs = customInputs || contextCustomInputs
  let inputDefinition = customInputs[input]
  if (!inputDefinition) inputDefinition = inputs[input]
  if (inputDefinition) throw Error(`[ui -> Input] input '${input}' is not defined. Use customInputs prop to specify it.`)
  return inputDefinition
}

const possibleInputs = Object.keys(inputs)
const possibleTypes = Object.keys(SCHEMA_TYPE_TO_INPUT)

Input.defaultProps = {
  type: 'text'
}

Input.propTypes = {
  type: PropTypes.oneOf(possibleInputs.concat(possibleTypes)),
  value: PropTypes.any,
  $value: PropTypes.any
}

export default observer(Input, { forwardRef: true })
