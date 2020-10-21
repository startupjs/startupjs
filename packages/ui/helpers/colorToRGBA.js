import Color from 'color'

const DEFAULT_OPACITY = 1

export default function colorToRGBA (color, alpha) {
  try {
    const fadeRatio = (DEFAULT_OPACITY * 100 - alpha * 100) / 100
    return Color(color).fade(fadeRatio).toString()
  } catch (err) {
    console.error('ERROR:', err.message)
    return color
  }
}
