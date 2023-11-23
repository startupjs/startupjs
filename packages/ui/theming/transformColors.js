export default function transformColors ({ colors = {}, palette = {} }) {
  const res = Object.keys(colors).reduce((vars, color) => {
    const prefix = color.includes('--color') ? '' : '--color-'
    vars[`${prefix}${color}`] = colors[color]
    return vars
  }, {})

  return Object.keys(palette).reduce((vars, color) => {
    const prefix = color.includes('--palette') ? '' : '--palette-'
    vars[`${prefix}${color}`] = palette[color]
    return vars
  }, res)
}
