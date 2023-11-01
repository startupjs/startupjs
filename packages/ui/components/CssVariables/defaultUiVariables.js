// TODO: Figure out if we would want to transition default UI colors to be dynamic
import palette from './defaultPalette.js'
import transformColors from './transformColors.js'

export default { ...getColors() }

function getColors () {
  return transformColors(palette.generateColors())
}
