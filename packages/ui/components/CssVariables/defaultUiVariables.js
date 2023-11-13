// TODO: Figure out if we would want to transition default UI colors to be dynamic
import palette from './defaultPalette'
import transformColors from './transformColors'

export default { ...getColors() }

function getColors () {
  return transformColors(palette.generateColors())
}
