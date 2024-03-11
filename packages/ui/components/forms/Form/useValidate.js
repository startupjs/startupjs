import { useMemo, useState, useCallback } from 'react'
import { transformSchema, ajv } from '@startupjs/schema'
import _set from 'lodash/set'
import _get from 'lodash/get'

export default function useValidate ({ always = false } = {}) {
  const forceUpdate = useForceUpdate()
  return useMemo(() => createValidateWrapper({ always, forceUpdate }), [])
}

function createValidateWrapper ({ always, forceUpdate }) {
  const _validate = new Validate({ always, forceUpdate })
  function validate () {
    if (!_validate.hasValidator()) throw Error(ERRORS.notInitialized)
    _validate.activate()
    return _validate.run()
  }
  // wrap 'validate' function into Proxy to make it behave like an instance of Validate class
  // while still being callable directly
  const methods = new WeakMap()
  return new Proxy(validate, {
    get (target, prop) {
      // This is a hack to force update the component the parent component when the errors change
      // if the parent component is using the errors prop to render something
      // (like disabling a Submit button when there are errors)
      // TODO: _shouldForceUpdate should correctly reset back to false if Form unmounts
      if (prop === 'errors') {
        _validate.makeReactive()
        return _validate.getErrors()
      } else if (prop === 'hasErrors') {
        _validate.makeReactive()
        return _validate.getHasErrors()
      }
      let res = Reflect.get(_validate, prop)
      // bind methods called on validate (which is a function) to the _validate object
      if (typeof res === 'function') {
        if (!methods.has(res)) methods.set(res, res.bind(_validate))
        res = methods.get(res)
      }
      return res
    }
  })
}

function useForceUpdate () {
  const [, setState] = useState(Math.random())
  // parent component's forceUpdate might be called from a child component
  // so we need to use setTimeout to make sure it runs asynchronously
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

class Validate {
  always

  #isReactive
  #lastHasErrors
  #forceUpdate
  #validator
  #formId

  constructor ({ forceUpdate, always }) {
    this.#forceUpdate = forceUpdate
    this.always = always
  }

  init ({ validator, formId }) {
    this.#validator = validator
    this.#formId = formId
    this.#validator.onHasErrorsChange = ({ formId } = {}) => {
      // only the Form which is currently associated with this 'validate' can force an update
      if (formId && formId !== this.#formId) return
      if (this.#isReactive) this.#forceUpdate()
    }
  }

  activate () {
    this.#validator.activate()
  }

  makeReactive () {
    this.#isReactive = true
  }

  hasValidator () {
    return !!this.#validator
  }

  run () {
    if (!this.#validator) throw Error('Validator is not set')
    return this.#validator.run()
  }

  getErrors () {
    return this.#validator?.getErrors()
  }

  getHasErrors () {
    const hasErrors = this.#validator?.getHasErrors()
    this.#lastHasErrors = hasErrors
    return hasErrors
  }

  reset ({ formId } = {}) {
    // if formId is set, reset only if it matches the formId currently associated with this 'validate'.
    // This prevents race conditions when a Form is unmounted and another Form is mounted right away
    // which uses the same 'validate' prop.
    // Only one Form can be associated with one 'validate' at a time.
    // TODO: add check to init() to prevent multiple Forms from using the same 'validate'.
    if (formId && formId !== this.#formId) return
    this.#validator = undefined
    this.#formId = undefined
    this.#isReactive = undefined
    if (this.#lastHasErrors) {
      this.#lastHasErrors = undefined
      this.#forceUpdate()
    }
  }
}

export class Validator {
  hasErrors
  onHasErrorsChange
  #active
  #validate
  #getValue
  #$errors
  #initialized
  #forceUpdate
  #formId

  init ({
    fields, // either simplified schema or full schema
    getValue, // obtain current value to validate (usually it will be from a closure of Form component)
    $errors, // reactive object to store errors, this is basically a hack to use model's .setDiffDeep()
    forceUpdate, // force update Form itself
    formId
  }) {
    let schema = fields
    // we allow extra properties in Form to let people just pass the full document
    // instead of forcing them to pick only the fields used in schema
    schema = transformSchema(schema, { additionalProperties: true })
    this.#validate = ajv.compile(schema)
    this.#getValue = getValue
    this.#$errors = $errors
    this.#forceUpdate = forceUpdate
    this.#formId = formId
    this.#initialized = true
  }

  activate () {
    this.#active = true
  }

  run () {
    if (!this.#active) return
    if (!this.#initialized) throw Error('Validator is not initialized')
    const valid = this.#validate(this.#getValue())
    if (valid) {
      if (this.hasErrors) {
        delete this.hasErrors
        this.#$errors.del()
        this.#forceUpdate?.()
        this.onHasErrorsChange?.({ formId: this.#formId })
      }
      return true
    } else {
      const newErrors = transformAjvErrors(this.#validate.errors)
      const hadErrors = this.hasErrors
      this.hasErrors = true
      this.#$errors.setDiffDeep(newErrors)
      if (!hadErrors) {
        this.#forceUpdate?.()
        this.onHasErrorsChange?.({ formId: this.#formId })
      }
      return false
    }
  }
}

// transform errors from ajv to our format
function transformAjvErrors (errors) {
  const res = {}
  for (const error of errors) {
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
    if (!_get(res, path)) _set(res, path, [])
    _get(res, path).push(message)
  }
  return res
}
