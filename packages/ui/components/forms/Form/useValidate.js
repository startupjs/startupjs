import { useMemo, useState, useCallback } from 'react'

export default function useValidate ({ always = false } = {}) {
  const _forceUpdate = useForceUpdate()
  return useMemo(() => {
    function validate () {
      if (!validate._validateNow) throw Error(ERRORS.notInitialized)
      validate._shouldValidate = true
      return validate._validateNow()
    }
    Object.assign(validate, {
      _forceUpdate,
      always
    })
    return new Proxy(validate, {
      get (target, prop) {
        // This is a hack to force update the component the parent component when the errors change
        // if the parent component is using the errors prop to render something
        // (like disabling a Submit button when there are errors)
        // TODO: _shouldForceUpdate should correctly reset back to false if Form unmounts
        if (prop === 'errors') {
          validate._shouldForceUpdate = true
          return Reflect.get(target, '_errors')
        } else if (prop === 'hasErrors') {
          validate._shouldForceUpdate = true
          return Reflect.get(target, '_hasErrors')
        }
        return Reflect.get(target, prop)
      }
    })
  }, [])
}

function useForceUpdate () {
  const [, setState] = useState(Math.random())
  return useCallback(() => setTimeout(() => setState(Math.random()), 0), [])
}

const ERRORS = {
  notInitialized: `
    useValidate():
    'validate' is not initialized with the Form component.

    You must pass 'validate' from useValidate()
    to the 'validate' prop of the Form component:

    const validate = useValidate()
    <Form validate={validate} ... />
  `
}
