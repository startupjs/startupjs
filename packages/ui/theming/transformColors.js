import merge from 'lodash/merge'

export default function transformColors ({ colors = {}, palette = {}, componentColors = {} }) {
  const transformedColors = Object.keys(colors).reduce((vars, color) => {
    const prefix = color.includes('--color') ? '' : '--color-'
    vars[`${prefix}${color}`] = colors[color]
    return vars
  }, {})

  return merge({}, componentColors, Object.keys(palette).reduce((vars, color) => {
    const prefix = color.includes('--palette') ? '' : '--palette-'
    vars[`${prefix}${color}`] = palette[color]
    return vars
  }, transformedColors))
}
