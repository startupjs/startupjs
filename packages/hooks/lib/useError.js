import { useState } from 'react'
import _set from 'lodash/set.js'

function validate (formSchema, data, options = {}) {
  const valid = formSchema.validate(
    data,
    Object.assign({}, { abortEarly: false }, options)
  )

  if (valid.error) {
    return valid.error.details.reduce((acc, item) => {
      _set(acc, item.context.label, item.message)
      return acc
    }, {})
  } else {
    return null
  }
}

export default function useError (data = {}) {
  const [err, setErr] = useState(data)

  function Err (err) {
    for (const key in err) {
      this[key] = err[key]
    }
  }

  Err.prototype.setValue = (key, value) => {
    setErr(Object.assign({}, this, { [key]: value }))
  }

  Err.prototype.check = (formSchema, data, options) => {
    setErr({})
    const errValid = validate(formSchema, data, options)
    if (errValid) {
      setErr(errValid)
      return true
    }
  }

  return [new Err(err), setErr]
};
