import Color from 'color'

export function getLabelColor (hex) {
  try {
    const threshold = 0.5
    const rgbColor = Color(hex).object()
    const r = rgbColor.r * 0.2126
    const g = rgbColor.g * 0.7152
    const b = rgbColor.b * 0.0722
    const lightness = (r + g + b) / 255
    const textColor = lightness >= threshold ? 'black' : 'white'
    return textColor
  } catch (err) {
    console.error('[getLabelColor]: Invalid hex color')
    return 'gray'
  }
}
