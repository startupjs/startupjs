module.exports = (hex, alpha = 1) => {
  const isHex = /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)
  if (!isHex) throw new Error(`Bad hex color - ${hex}`)
  let c
  c = hex.substring(1).split('')
  if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]]
  c = '0x' + c.join('')
  c = [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')
  return 'rgba(' + c + ',' + alpha + ')'
}
