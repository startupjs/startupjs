import propTypes from 'prop-types'
import ThemeContext from './ThemeContext'

const ThemeProvider = ThemeContext.Provider
ThemeProvider.propTypes = {
  value: propTypes.string
}

export default ThemeProvider
