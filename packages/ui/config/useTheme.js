// TODO: Change prefixing algo to be like `clsx` for better performance.
//       (https://github.com/lukeed/clsx)

import React, { useContext } from 'react'

const ThemeContext = React.createContext()
const memoizedThemes = {}
const memoizedThemedFns = {}

export default function useTheme (forceTheme) {
  let theme = useContext(ThemeContext)
  if (forceTheme) theme = forceTheme
  return [getMemoizedThemedFn(theme), getMemoizedTheme(forceTheme)]
}

// `themed` function

function getMemoizedThemedFn (theme) {
  if (!theme) return notThemed
  if (memoizedThemedFns[theme]) return memoizedThemedFns[theme]
  memoizedThemedFns[theme] = function themed (...modifiers) {
    return [modifiers, theme, _themed(theme, modifiers)]
  }
  return memoizedThemedFns[theme]
}

function notThemed (...modifiers) {
  return modifiers
}

function _themed (theme, modifiers) {
  return modifiers.map(modifier => {
    if (isArray(modifier)) return _themed(theme, modifier)
    if (typeof modifier === 'string') return prefix(theme, modifier)
    var res = {}
    for (var key in modifier) {
      res[prefix(theme, key)] = modifier[key]
    }
    return res
  })
}

function prefix (prefix, name) {
  return prefix + '-' + name
}

function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}

// `Theme` component

function NoTheme (props) {
  return props.children
}

function getMemoizedTheme (theme) {
  if (!theme) return NoTheme
  if (memoizedThemes[theme]) return memoizedThemes[theme]
  memoizedThemes[theme] = function Theme (props) {
    return pug`
      ThemeContext.Provider(value=theme)= props.children
    `
  }
  memoizedThemes[theme].displayName = 'Theme' + theme.charAt(0).toUpperCase() + theme.slice(1)
  return memoizedThemes[theme]
}
