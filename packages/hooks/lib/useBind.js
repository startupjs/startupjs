import { useMemo } from 'react'

export default function useBind (props) {
  let getterName, setterName, $value

  for (const key in props) {
    if (/^\$/.test(key)) $value = props[key]
    else if (/^on[A-Z]/.test(key)) setterName = key
    else getterName = key
  }

  const $aValue = useMemo(() => {
    if ($value && typeof $value === 'string') {
      throw Error('useBind: $value should be a signal, not a string')
      // TODO: maybe allow passing a string. For this add the .at() method to base Signal
      // if (/.+\..+/.test($value)) {
      //   return $.at($value)
      // } else {
      //   console.error(`[getBindingProps] You can not specify the top-level absolute path in $value: ${$value}`)
      //   return undefined
      // }
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
          // handle undefined value and an empty string in a special way:
          // do model.del() on it to completely remove the field
          if (typeof value === 'undefined' || value === '') {
            if (typeof $aValue.get() !== 'undefined') $aValue.del()
          } else {
            $aValue.set(value)
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
