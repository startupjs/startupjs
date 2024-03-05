import { useMemo } from 'react'
import { $root } from '@startupjs/react-sharedb'

export default function useBind (props) {
  let getterName, setterName, $value

  for (const key in props) {
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
        res[getterName] = $aValue.get()
      } else {
        const aValue = props[getterName]
        res[getterName] = aValue
      }
    }

    if (setterName) {
      if ($aValue != null) {
        res[setterName] = value => {
          if (!$aValue) return
          // handle undefined value in a special way:
          // do model.del() on it to completely remove the field
          if (typeof value === 'undefined') {
            if (typeof $aValue.get() !== 'undefined') $aValue.del()
          } else {
            $aValue.setDiff(value)
          }
        }
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
