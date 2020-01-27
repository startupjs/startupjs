import React, { useContext } from 'react'
import propTypes from 'prop-types'

const ThemeContext = React.createContext()

const ThemeProvider = ThemeContext.Provider
ThemeProvider.propTypes = {
  value: propTypes.string
}

export { ThemeProvider }

export default function themed (Component) {
  function ThemeWrapper (props) {
    let contextTheme = useContext(ThemeContext)
    let theme = props.theme || contextTheme
    let res
    if (theme && (!props.theme || props.theme !== theme)) {
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
