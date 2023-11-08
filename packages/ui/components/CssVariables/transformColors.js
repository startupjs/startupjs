export default function transformColors ({ colors, palette }) {
  const res = Object.keys(colors).reduce((vars, color) => {
    vars[`--color-${color}`] = colors[color]
    return vars
  }, {})

  return Object.keys(palette).reduce((vars, color) => {
    vars[`--palette-${color}`] = palette[color]
    return vars
  }, res)
}
