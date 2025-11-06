import React, { useContext } from 'react'
import { matcher } from 'startupjs'
import memoize from 'lodash/memoize'
import ThemeContext from './ThemeContext'
import { useStyle } from '../StyleContext'

const memoizedMatcher = memoize(matcher, name => name)

// TODO: Move themed inside react-sharedb's observer()
export default function themed (name, Component) {
  if (typeof name !== 'string') {
    Component = name
    name = Component.displayName || Component.name
  }

  function ThemeWrapper (props, ref) {
    // Setup global component style overrides
    const uiStyle = useStyle()

    if (uiStyle) {
      const styleProps = memoizedMatcher(name, uiStyle, '', '', {}) || {}
      const keysLength = Object.keys(styleProps).length
      if (
        keysLength > 0 &&
        // Handle special case when we have an empty style array
        // TODO: Fix returning an empty style array
        !(keysLength === 1 && Array.isArray(styleProps.style) && styleProps.style.length === 0)
      ) {
        const newStyleProps = {}
        for (const key in styleProps) {
          if (props[key]) {
            newStyleProps[key] = [styleProps[key], props[key]]
          } else {
            newStyleProps[key] = styleProps[key]
          }
        }
        props = { ...props, ...newStyleProps }
      }
    }

    // Setup theme context
    const contextTheme = useContext(ThemeContext)
    const theme = props.theme || contextTheme
    let res
    if (theme && !props.theme) {
      res = Component({ theme, ...props }, ref)
    } else {
      res = Component(props, ref)
    }
    return (props.theme && (!contextTheme || contextTheme !== props.theme))
      ? (
          React.createElement(
            ThemeContext.Provider,
            { value: props.theme },
            res
          )
        )
      : res
  }

  ThemeWrapper.displayName = Component.displayName || Component.name
  ThemeWrapper.propTypes = Component.propTypes
  ThemeWrapper.defaultProps = Component.defaultProps

  return ThemeWrapper
}
