import React, { useMemo } from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import ObjectInput from '../ObjectInput'
import { CustomInputsContext } from './useCustomInputs'
import { FormPropsContext } from './useFormProps'

function Form ({
  fields = {},
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

  const memoizedProps = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => props, [...Object.keys(props), ...Object.values(props)]
  )

  const memoizedCustomInputs = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => customInputs, [...Object.keys(customInputs), ...Object.values(customInputs)]
  )

  return pug`
    FormPropsContext.Provider(value=memoizedProps)
      CustomInputsContext.Provider(value=memoizedCustomInputs)
        ObjectInput(
          properties=memoizedFields
          $value=$value
          order=order
          row=row
          errors=errors
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
