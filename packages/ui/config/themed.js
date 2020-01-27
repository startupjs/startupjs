import React, { useContext } from 'react'

const ThemeContext = React.createContext()

export const ThemeProvider = ThemeContext.Provider

export default function themed (Component) {
  function ThemeWrapper (props) {
    let contextTheme = useContext(ThemeContext)
    let theme = props.theme || contextTheme
    let res
    if (theme && !props.theme) {
      res = Component({ theme, ...props })
    } else {
      res = Component(props)
    }
    return (props.theme && (!contextTheme || contextTheme !== props.theme)) ? (
      React.createElement(
        ThemeContext.Provider,
        { value: props.theme },
        res
      )
    ) : (
      res
    )
  }
  ThemeWrapper.displayName = Component.displayName || Component.name
  ThemeWrapper.propTypes = Component.propTypes
  ThemeWrapper.defaultProps = Component.defaultProps
  return ThemeWrapper
}
