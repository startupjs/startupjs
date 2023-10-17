// TODO: Figure out if we would want to transition default UI colors to be dynamic
import STYLES from './defaultUiVariables.styl'
import generateColors from './generateColors.js'
import palette, { skipLowest, skipHighest } from './defaultPalette.js'

const { staticColors } = STYLES

export default {
  ...getDeprecatedColors(), // DEPRECATED: old colors which were set in the stylesheets
  ...getColors()
}

// DEPRECATED: old colors which were set in the stylesheets
function getDeprecatedColors () {
  return Object.keys(staticColors).reduce((vars, color) => {
    vars[`--colors-${color}`] = staticColors[color]
    return vars
  }, {})
}

function getColors () {
  const colors = generateColors({ palette, skipLowest, skipHighest })
  return Object.keys(colors).reduce((vars, color) => {
    vars[`--color-${color}`] = colors[color]
    return vars
  }, {})
}
