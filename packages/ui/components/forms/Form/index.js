import React, { useMemo, useCallback, useImperativeHandle, useRef } from 'react'
import { pug, observer, useOn, useValue$ } from 'startupjs'
import { transformSchema, ajv } from '@startupjs/schema'
import _set from 'lodash/set'
import _get from 'lodash/get'
import _debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import ObjectInput from '../ObjectInput'
import { CustomInputsContext } from './useCustomInputs'
import { FormPropsContext } from './useFormProps'

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
}, ref) {
  if (properties) throw Error(ERROR_PROPERTIES)
  const { disabled, readonly, $value } = props

  const shouldValidateRef = useRef()

  const memoizedFields = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => fields, [JSON.stringify(fields)]
  )

  if (!$errors) $errors = useValue$() // eslint-disable-line react-hooks/rules-of-hooks

  const runValidation = useMemo(() => {
    let schema = $fields?.get() || memoizedFields
    // we allow extra properties in Form to let people just pass the full document
    // instead of forcing them to pick only the fields used in schema
    schema = transformSchema(schema, { additionalProperties: true })
    return ajv.compile(schema)
  }, [JSON.stringify(memoizedFields), $fields])

  const memoizedProps = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => props, [...Object.keys(props), ...Object.values(props)]
  )

  const memoizedCustomInputs = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => customInputs, [...Object.keys(customInputs), ...Object.values(customInputs)]
  )

  const validateNow = useCallback(() => {
    if (!shouldValidateRef.current) return
    const valid = runValidation($value.get())
    if (valid) {
      $errors.del()
      return true
    }
    const localErrors = {}
    for (const error of runValidation.errors) {
      const path = error.instancePath.replace(/^\//, '').split('/')
      // handle special case for 'required' fields.
      // It happens on the level above the field which is actually required
      // and the actual field name is located in params.missingProperty
      let message = error.message
      if (error.keyword === 'required') {
        if (path.length > 0 && path[path.length - 1] === '') path.pop()
        path.push(error.params.missingProperty)
        message = 'This field is required'
      }
      if (!_get(localErrors, path)) _set(localErrors, path, [])
      _get(localErrors, path).push(message)
    }
    $errors.setDiffDeep(localErrors)
    return false
  }, [runValidation, $value, $errors])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidate = useCallback(
    _debounce(validateNow, 30, { leading: false, trailing: true })
    , [validateNow]
  )

  useImperativeHandle(ref, () => ({
    validate: () => {
      shouldValidateRef.current = true
      return validateNow()
    }
  }), [validateNow])

  useOn('all', $value.path() + '.**', debouncedValidate)

  useMemo(() => {
    // if validate prop is set, trigger validation right away on mount.
    if (validate) {
      shouldValidateRef.current = true
      validateNow()
    } else {
      // Otherwise the reactive validation will only start after
      // Form.validate() is called for the first time.
      // And we reset $errors on mount to clear any errors that might have been set
      // from the previous try to submit the form with $errors passed from a parent component.
      // Even if $errors is passed from a parent component Form itself still fully owns it
      $errors.del()
    }
  }, [])

  return pug`
    FormPropsContext.Provider(value=memoizedProps)
      CustomInputsContext.Provider(value=memoizedCustomInputs)
        ObjectInput(
          properties=$fields?.get() || memoizedFields
          $value=$value
          $errors=$errors
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

export default observer(Form, { forwardRef: true })

const ERROR_PROPERTIES = `
  Form: 'properties' prop can only be used directly in ObjectInput.
        Use 'fields' instead
`
