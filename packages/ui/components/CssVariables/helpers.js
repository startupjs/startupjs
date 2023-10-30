// refs:
// https://accessiblepalette.com/?lightness=98,93.3,88.6,79.9,71.2,60.5,49.8,38.4,27,15.6&e94c49=1,0&F1903C=1,-10&f3e203=1,-15&89BF1D=0,0&64c273=0,15&007DCC=0,0&808080=0,0&EAE8DE=0,0&768092=0,0
// https://www.ibm.com/design/language/color/
import Colors from './Colors'
import { TheColor } from './TheColor'

export function getPaletteMeta (palette) {
  const res = {}
  const high = Object.values(palette)[0].length - 1
  res.low = 0 // darkest colorful color
  res.high = high // lightest colorful color
  res.middle = Math.floor(high / 2) + 1 // first light color
  return res
}

export function rgbToHex (r, g, b) {
  // Ensure that the input values are within the valid range
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))

  // Convert the RGB values to hexadecimal
  const hexR = r.toString(16).padStart(2, '0')
  const hexG = g.toString(16).padStart(2, '0')
  const hexB = b.toString(16).padStart(2, '0')

  return `#${hexR}${hexG}${hexB}`
}

// Extract RGB values from RGB or RGBA string
export function extractRGB (str) {
  const match = str.match(/(\d+\.?\d*|\.\d+)/g) // improved regex to match decimals
  if (!match) return []
  return match.map(Number)
}

export function rgba (color, alpha) {
  if (typeof alpha !== 'number' || alpha < 0 || alpha > 1) {
    throw new Error('Invalid alpha value. It should be between 0 and 1.')
  }

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    if (hex.startsWith('#')) hex = hex.slice(1)
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
  }

  if (color.startsWith('#')) {
    const [r, g, b] = hexToRgb(color)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } else if (color.startsWith('rgb')) {
    const values = extractRGB(color)
    if (values.length === 3 || values.length === 4) {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`
    }
  }

  throw new Error('Invalid color format. Supported formats are hex, rgb, and rgba.')
}

// find color in palette by the color value itself
// (note that hex/rgb/rgba matters -- it's considered to be different colors)
export function findColorInPalette (color, palette) {
  let alpha

  if (color.includes('rgb')) {
    const rgbValues = extractRGB(color)
    const [r, g, b, a] = rgbValues
    if (a != null) alpha = a
    color = rgbToHex(r, g, b)
  }

  if (color === palette.black) return ['coolGray', -1, alpha]
  if (color === palette.white) return ['coolGray', Object.values(palette)[0].length, alpha]

  let foundName
  let foundLevel
  for (const name in palette) {
    const level = palette[name].indexOf(color)
    if (level !== -1) {
      foundName = name
      foundLevel = level
      break
    }
  }

  return [foundName, foundLevel, alpha]
}

/* eslint-disable dot-notation, no-multi-spaces */
export function fillColorsObject (C, P, palette, Color, { overrides = {}, high, low, middle }) {
  for (const colorName in overrides) {
    const color = overrides[colorName]
    if (color instanceof TheColor) {
      C[colorName] = color
    } else {
      const [paletteColorName, level, alpha] = findColorInPalette(color, palette)
      if (!paletteColorName) throw Error(`'${colorName}' does not exist in palette. You can only pass a color from palette.`)
      C[colorName] = Color(paletteColorName, level, { alpha })
    }
  }

  // base colors
  C[Colors['text-on-color']]                ??= Color('coolGray', high)
  C[Colors.bg]                              ??= Color('coolGray', high)
  C[Colors.text]                            ??= Color('coolGray', low + 2)
  C[Colors.border]                          ??= Color('coolGray', high - 2)
  C[Colors.primary]                         ??= Color('blue', middle)
  C[Colors.secondary]                       ??= Color('coolGray', low + 2)
  C[Colors.error]                           ??= Color('red', middle)
  C[Colors.success]                         ??= Color('green', middle)
  C[Colors.warning]                         ??= Color('yellow', middle + 2)
  C[Colors.info]                            ??= Color('cyan', middle + 1)
  C[Colors.attention]                       ??= Color('orange', middle)
  C[Colors.special]                         ??= Color('purple', middle - 1)
  // Dark theme colors
  // C[Colors.bg]                              ??= Color('coolGray', low)
  // C[Colors.text]                            ??= Color('coolGray', high)
  // C[Colors.border]                          ??= Color('coolGray', low + 2)
  // C[Colors.secondary]                       ??= Color('coolGray', high)

  // all other colors are generated from the base colors

  // main bg colors
  C[Colors['bg-primary']]                   ??= C[Colors.primary]
  C[Colors['bg-secondary']]                 ??= C[Colors.secondary]
  C[Colors['bg-error']]                     ??= C[Colors.error]
  C[Colors['bg-success']]                   ??= C[Colors.success]
  C[Colors['bg-warning']]                   ??= C[Colors.warning]
  C[Colors['bg-info']]                      ??= C[Colors.info]
  C[Colors['bg-attention']]                 ??= C[Colors.attention]
  C[Colors['bg-special']]                   ??= C[Colors.special]

  // extra bg colors
  C[Colors['bg-inverse']]                   ??= C[Colors.bg].dimmer(7)
  C[Colors['bg-inverse-alt']]               ??= C[Colors.bg].dimmer(6)
  C[Colors['bg-inverse-transparent']]       ??= C[Colors['bg-inverse']].setAlpha(0.05)
  C[Colors['bg-dim']]                       ??= C[Colors.bg].dimmer(1)
  C[Colors['bg-dim-alt']]                   ??= C[Colors.bg].dimmer(2)
  C[Colors['bg-strong']]                    ??= C[Colors.bg].stronger(1)
  C[Colors['bg-primary-inverse']]           ??= C[Colors.primary].highContrast()
  C[Colors['bg-primary-dim']]               ??= C[Colors.primary].dimmer(3)
  C[Colors['bg-primary-transparent']]       ??= C[Colors.primary].setAlpha(0.05)
  C[Colors['bg-secondary-inverse']]         ??= C[Colors.secondary].highContrast()
  C[Colors['bg-error-inverse']]             ??= C[Colors.error].highContrast()
  C[Colors['bg-error-transparent']]         ??= C[Colors.error].setAlpha(0.05)
  C[Colors['bg-success-inverse']]           ??= C[Colors.success].highContrast()
  C[Colors['bg-success-transparent']]       ??= C[Colors.success].setAlpha(0.05)
  C[Colors['bg-warning-inverse']]           ??= C[Colors.warning].highContrast()
  C[Colors['bg-warning-transparent']]       ??= C[Colors.warning].setAlpha(0.05)
  C[Colors['bg-info-inverse']]              ??= C[Colors.info].highContrast()
  C[Colors['bg-attention-inverse']]         ??= C[Colors.attention].highContrast()
  C[Colors['bg-special-inverse']]           ??= C[Colors.special].highContrast()

  // text
  C[Colors['text-description']]             ??= C[Colors.text].dimmer(2)
  C[Colors['text-placeholder']]             ??= C[Colors.text].dimmer(4)
  C[Colors['text-primary']]                 ??= C[Colors.primary]
  C[Colors['text-secondary']]               ??= C[Colors.secondary]
  C[Colors['text-error']]                   ??= C[Colors.error]
  C[Colors['text-success']]                 ??= C[Colors.success]
  C[Colors['text-warning']]                 ??= C[Colors.warning]
  C[Colors['text-info']]                    ??= C[Colors.info]
  C[Colors['text-attention']]               ??= C[Colors.attention]
  C[Colors['text-special']]                 ??= C[Colors.special]

  // extra text colors
  C[Colors['text-success-strong']]          ??= C[Colors.success].stronger(2)
  C[Colors['text-info-strong']]             ??= C[Colors.info].stronger(2)

  // text on different backgrounds
  C[Colors['text-on-bg-inverse']]           ??= C[Colors.text].dimmer(5)
  C[Colors['text-on-primary']]              ??= C[Colors.primary].stronger(4)
  C[Colors['text-on-secondary']]            ??= C[Colors.secondary].highContrast()
  C[Colors['text-on-error']]                ??= C[Colors.error].stronger(4)
  C[Colors['text-on-success']]              ??= C[Colors.success].stronger(4)
  C[Colors['text-on-warning']]              ??= C[Colors.warning].stronger(3)
  C[Colors['text-on-info']]                 ??= C[Colors.info].highContrast()
  C[Colors['text-on-attention']]            ??= C[Colors.attention].stronger(4)
  C[Colors['text-on-special']]              ??= C[Colors.special].highContrast()

  // border
  C[Colors['border-strong']]                ??= C[Colors.border].stronger(3)
  C[Colors['border-primary']]               ??= C[Colors.primary]
  C[Colors['border-secondary']]             ??= C[Colors.secondary]
  C[Colors['border-error']]                 ??= C[Colors.error]
  C[Colors['border-success']]               ??= C[Colors.success]
  C[Colors['border-warning']]               ??= C[Colors.warning]
  C[Colors['border-info']]                  ??= C[Colors.info]
  C[Colors['border-attention']]             ??= C[Colors.attention]
  C[Colors['border-special']]               ??= C[Colors.special]

  // extra border colors
  C[Colors['border-inverse']]               ??= C[Colors.border].dimmer(5)
  C[Colors['border-dim']]                   ??= C[Colors.border].dimmer(1)
  C[Colors['border-strong-alt']]            ??= C[Colors.border].stronger(1)

  // add palette colors
  for (const colorName in palette) {
    if (colorName === 'black') {
      P[colorName] = Color('coolGray', -1)
    } else if (colorName === 'white') {
      P[colorName] = Color('coolGray', Object.values(palette)[0].length)
    } else {
      const colors = palette[colorName]
      for (let i = 0; i < colors.length; i++) {
        P[`${colorName}-${i}`] = Color(colorName, i)
      }
    }
  }
}
/* eslint-enable dot-notation, no-multi-spaces */
