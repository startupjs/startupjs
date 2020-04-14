import { useLocal, useSyncEffect, useComponentId } from 'startupjs'

export default function useLocalWithDefault (path, defaultValue) {
  if (defaultValue == null) {
    throw new Error('useLocalWithDefault: default value is required')
  }

  const componentId = useComponentId()
  if (!path) path = `_session.${componentId}`
  const [value, $value] = useLocal(path)

  useSyncEffect(() => {
    $value.setNull(defaultValue)
  }, [])

  return [value, $value]
}
