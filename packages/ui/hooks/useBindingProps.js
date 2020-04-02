import { useMemo } from 'react'
import { $root } from 'startupjs'

export default function useBindingProps ($value, getter, setter) {
  const $aValue = useMemo(() => {
    if ($value && typeof $value === 'string') {
      if (/.+\..+/.test($value)) {
        return $root.at($value)
      } else {
        console.error(`[getBindingProps] You can not specify the top-level absolute path in $value: ${$value}`)
        return undefined
      }
    } else {
      return $value
    }
  }, [$value])
  try {
    const res = {}

    const getterName = getter && Object.keys(getter)[0]
    if (getterName) {
      if ($aValue != null) {
        res[getterName] = $aValue.get()
      } else {
        res[getterName] = getter[getterName]
      }
    }

    const setterName = setter && Object.keys(setter)[0]
    if (setterName) {
      if ($aValue != null) {
        res[setterName] = value => $aValue && $aValue.setDiff(value)
      } else {
        res[setterName] = setter[setterName]
      }
    }

    return res
  } catch (err) {
    console.error(err)
    return {}
  }
}
