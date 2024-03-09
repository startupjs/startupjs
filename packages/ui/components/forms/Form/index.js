import React, { useMemo, useCallback } from 'react'
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
  style,
  inputStyle,
  customInputs = {},
  ...props
}) {
  if (properties) throw Error(ERROR_PROPERTIES)
  const { disabled, readonly, $value } = props

  const memoizedFields = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => fields, [JSON.stringify(fields)]
  )

  if (!$errors) $errors = useValue$() // eslint-disable-line react-hooks/rules-of-hooks

  const validate = useMemo(() => {
    let schema = $fields?.get() || memoizedFields
    // we allow extra properties in Form to let people just pass the full document
    // instead of forcing them to pick only the fields used in schema
    schema = transformSchema(schema, { additionalProperties: true })
    return ajv.compile(schema)
  }, [JSON.stringify(memoizedFields), $fields?.get()])

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
    _debounce(() => {
      const valid = validate($value.get())
      if (valid) return $errors.del()
      const localErrors = {}
      for (const error of validate.errors) {
        const path = error.instancePath.replace(/^\//, '').split('/')
        if (!_get(localErrors, path)) _set(localErrors, path, [])
        _get(localErrors, path).push(error.message)
      }
      $errors.setDiffDeep(localErrors)
    }, 30, { leading: false, trailing: true })
    , [validate, $value, $errors]
  )

  useOn('all', $value.path() + '.**', debouncedValidate)

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

export default observer(Form)

const ERROR_PROPERTIES = `
  Form: 'properties' prop can only be used directly in ObjectInput.
        Use 'fields' instead
`
