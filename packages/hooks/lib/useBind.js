import { useMemo, useLayoutEffect } from 'react'
import { $root } from '@startupjs/react-sharedb'

export default function useBind (props) {
  let getterName, setterName, $value

  for (const key in props) {
    if (key === 'default') continue
    if (/^\$/.test(key)) $value = props[key]
    else if (/^on[A-Z]/.test(key)) setterName = key
    else getterName = key
  }

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

    if (getterName) {
      if ($aValue != null) {
        const aValue = $aValue.get()
        useLayoutEffect(() => {
          if ($aValue && typeof aValue === 'undefined') {
            $aValue.setNull(props.default)
          }
        }, [])
        res[getterName] = aValue
      } else {
        const aValue = props[getterName]
        res[getterName] = aValue
        useMemo(() => {
          if (typeof aValue === 'undefined') {
            res[getterName] = props.default
          }
        }, [])
      }
    }

    if (setterName) {
      if ($aValue != null) {
        res[setterName] = value => $aValue && $aValue.setDiff(value)
      } else {
        res[setterName] = props[setterName]
      }
    }

    return res
  } catch (err) {
    console.error(err)
    return {}
  }
}
