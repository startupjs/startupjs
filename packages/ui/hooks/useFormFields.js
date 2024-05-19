import { useMemo } from 'react'
import { pickFormFields } from 'startupjs'

export default function useFormFields (schema, options = {}) {
  return useMemo(() => {
    const fields = pickFormFields(schema, options)
    return JSON.parse(JSON.stringify(fields))
  }, [schema, JSON.stringify(options)])
}
