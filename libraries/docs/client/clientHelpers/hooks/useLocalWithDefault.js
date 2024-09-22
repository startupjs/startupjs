import { useLocal, useSyncEffect, useComponentId } from 'startupjs'

export default function useLocalWithDefault (path, defaultValue) {
  if (defaultValue == null) {
    throw new Error('useLocalWithDefault: default value is required')
  }

  const componentId = useComponentId()
  if (!path) path = `_session.${componentId}`
  const [value, $value] = useLocal(path)

  useSyncEffect(() => {
    if (!(value == null)) return
    throw $value.set('', defaultValue)
  }, [])

  return [value, $value]
}
