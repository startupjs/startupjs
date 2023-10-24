// TODO: Figure out if we would want to transition default UI colors to be dynamic
import generateColors from './generateColors.js'
import palette, { skipLowest, skipHighest } from './defaultPalette.js'

export default { ...getColors() }

function getColors () {
  const colors = generateColors({ palette, skipLowest, skipHighest })
  return Object.keys(colors).reduce((vars, color) => {
    vars[`--color-${color}`] = colors[color]
    return vars
  }, {})
}
