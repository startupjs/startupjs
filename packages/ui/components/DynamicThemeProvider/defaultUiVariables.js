// TODO: Figure out if we would want to transition default UI colors to be dynamic
import STYLES from './defaultUiVariables.styl'

const { staticColors } = STYLES

export default {
  ...getColors()
}

function getColors () {
  return Object.keys(staticColors).reduce((vars, color) => {
    vars[`--colors-${color}`] = staticColors[color]
    return vars
  }, {})
}
