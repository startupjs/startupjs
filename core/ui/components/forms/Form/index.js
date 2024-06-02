import React, { useMemo, useCallback, useState, useId, useRef } from 'react'
import { pug, observer, $ } from 'startupjs'
import _debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import ObjectInput from '../ObjectInput'
import { CustomInputsContext } from './useCustomInputs'
import { FormPropsContext } from './useFormProps'
import { Validator } from './useValidate'

function Form ({
  fields = {},
  $fields,
  $errors,
  properties,
  order,
  row,
  errors,
  _renderWrapper,
  validate,
  style,
  inputStyle,
  customInputs = {},
  ...props
}) {
  if (properties) throw Error(ERROR_PROPERTIES)
  const { disabled, readonly, $value } = props

  const formId = useId()
  const forceUpdate = useForceUpdate()

  const memoizedFields = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => fields, [JSON.stringify(fields)]
  )

  if (!$errors) $errors = $() // eslint-disable-line react-hooks/rules-of-hooks
  const validator = useMemo(() => new Validator(), [])

  useMemo(() => {
    validator.init({
      fields: $fields?.get() || memoizedFields,
      getValue: () => $value.get(),
      $errors,
      forceUpdate,
      formId
    })
  }, [JSON.stringify(memoizedFields), $fields, $value, $errors, forceUpdate, formId])

  const memoizedProps = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => props, [...Object.keys(props), ...Object.values(props)]
  )

  const memoizedCustomInputs = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => customInputs, [...Object.keys(customInputs), ...Object.values(customInputs)]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidate = useCallback(
    _debounce(() => validator.run(), 30, { leading: false, trailing: true }),
    [validator]
  )

  // TODO: $(fn, triggerFn)
  // $(() => JSON.stringify($value.get()), debouncedValidate)
  useRef($(() => {
    JSON.stringify($value.get())
    debouncedValidate()
  }))

  useMemo(() => {
    // if validate prop is set, trigger validation right away on mount.
    if (validate === true) {
      validator.activate()
      validator.run()
    } else if (typeof validate === 'function') {
      validate.reset()
      validate.init({ validator, formId })
      if (validate.always) {
        validator.activate()
        validator.run()
      }
      // when Form is unmounted, reset the parent's validate
      return () => validate.reset({ formId })
    }
  }, [])

  return pug`
    FormPropsContext.Provider(value=memoizedProps)
      CustomInputsContext.Provider(value=memoizedCustomInputs)
        ObjectInput(
          properties=$fields?.get() || memoizedFields
          $value=$value
          order=order
          row=row
          errors=errors || $errors.get()
          style=style
          inputStyle=inputStyle
          _renderWrapper=_renderWrapper
          disabled=disabled
          readonly=readonly
        )
  `
}

Form.defaultProps = {
  fields: {}
}

Form.propTypes = {
  fields: PropTypes.object,
  $value: PropTypes.any
}

export default observer(Form)

function useForceUpdate () {
  const [, setState] = useState(Math.random())
  return useCallback(() => setState(Math.random()), [])
}

const ERROR_PROPERTIES = `
  Form: 'properties' prop can only be used directly in ObjectInput.
        Use 'fields' instead
`
