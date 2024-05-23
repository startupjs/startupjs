import { useRef, useMemo } from 'react'
import { $ } from 'startupjs'
import useFormFields from './useFormFields.js'

export default function useFormFields$ (schema, options) {
  const firstRenderRef = useRef(true)
  const prevFieldsRef = useRef()
  const fields = useFormFields(schema, options)
  const $fields = $(fields)

  const [firstRender, prevFields] = useMemo(() => {
    const firstRender = firstRenderRef.current
    firstRenderRef.current = false
    const prevFields = prevFieldsRef.current
    prevFieldsRef.current = fields
    return [firstRender, prevFields]
  }, [JSON.stringify(fields)])

  if (!firstRender && prevFields !== fields) {
    $fields.set(fields)
  }

  return $fields
}
