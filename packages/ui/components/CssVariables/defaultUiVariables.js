// TODO: Figure out if we would want to transition default UI colors to be dynamic
import palette from './defaultPalette.js'

export default { ...getColors() }

function getColors () {
  const { palette: generatedPalette, colors } = palette.generateColors()
  const res = Object.keys(colors).reduce((vars, color) => {
    vars[`--color-${color}`] = colors[color]
    return vars
  }, {})

  return Object.keys(generatedPalette).reduce((vars, color) => {
    vars[`--palette-${color}`] = generatedPalette[color]
    return vars
  }, res)
}
