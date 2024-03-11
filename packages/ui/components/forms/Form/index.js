import React, { useMemo, useCallback, useRef, useState } from 'react'
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
  properties,
  order,
  row,
  _renderWrapper,
  validate,
  style,
  inputStyle,
  customInputs = {},
  ...props
}) {
  if (properties) throw Error(ERROR_PROPERTIES)
  const { disabled, readonly, $value } = props

  const shouldValidateRef = useRef()
  const hasErrorsRef = useRef()
  const forceUpdate = useForceUpdate()

  const memoizedFields = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => fields, [JSON.stringify(fields)]
  )

  const $errors = useValue$() // eslint-disable-line react-hooks/rules-of-hooks

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
    if (!(
      shouldValidateRef.current ||
      (typeof validate === 'function' && validate._shouldValidate)
    )) return
    const valid = runValidation($value.get())
    if (valid) {
      if (hasErrorsRef.current) {
        hasErrorsRef.current = false
        $errors.del()
        if (typeof validate === 'function') {
          validate._hasErrors = false
          delete validate._errors
          if (validate._shouldForceUpdate) validate._forceUpdate()
        }
        forceUpdate()
      }
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
    if (!hasErrorsRef.current) {
      hasErrorsRef.current = true
      if (typeof validate === 'function' && !validate._hasErrors) {
        validate._hasErrors = true
        validate._errors = $errors.get()
        if (validate._shouldForceUpdate) validate._forceUpdate()
      }
      forceUpdate()
    }
    return false
  }, [runValidation, $value])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidate = useCallback(
    _debounce(validateNow, 30, { leading: false, trailing: true })
    , [validateNow]
  )

  useOn('all', $value.path() + '.**', debouncedValidate)

  function resetValidate () {
    delete validate._hasErrors
    delete validate._errors
    delete validate._shouldValidate
    delete validate._validateNow
  }

  useMemo(() => {
    // if validate prop is set, trigger validation right away on mount.
    if (validate === true) {
      shouldValidateRef.current = true
      validateNow()
    } else if (typeof validate === 'function') {
      const hadErrors = validate._hasErrors
      resetValidate()
      validate._validateNow = validateNow
      if (validate.always) {
        validate._shouldValidate = true
        validateNow()
      } else {
        if (hadErrors && validate._shouldForceUpdate) validate._forceUpdate()
      }
    }
    return () => {
      // when Form is unmounted, remove validateNow from validate function
      if (typeof validate === 'function') {
        const hadErrors = validate._hasErrors
        resetValidate()
        if (hadErrors) validate._forceUpdate()
      }
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
          errors=$errors.get()
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
