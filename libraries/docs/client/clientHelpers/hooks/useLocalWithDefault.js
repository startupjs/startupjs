import { $, useSyncEffect, useId } from 'startupjs'

export default function useLocalWithDefault (path, defaultValue) {
  if (defaultValue == null) {
    throw new Error('useLocalWithDefault: default value is required')
  }

  const componentId = useId()
  if (!path) path = `_session.${componentId}`
  const $value = path.split('.').reduce((acc, part) => acc[part], $)

  useSyncEffect(() => {
    if (!($value.get() == null)) return
    throw $value.set(defaultValue)
  }, [])

  return [$value.get(), $value]
}
