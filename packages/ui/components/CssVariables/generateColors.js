import ColorsEnum from './ColorsEnum'

// find color in palette by the color value itself
// (note that hex/rgb/rgba matters -- it's considered to be different colors)
export const findColorInPalette = (color, palette) => {
  if (color === palette.gray[0]) return ['gray', 0]
  if (color === palette.gray[palette.gray.length - 1]) return ['gray', palette.gray.length]
  for (const name in palette) {
    const level = palette[name].indexOf(color)
    if (level !== -1) return [name, level]
  }
  return [] // color not found in palette, return empty array
}

function getPaletteMeta (palette, { skipLowest = 2, skipHighest = 1 } = {}) {
  const res = {}
  res.low = skipLowest // darkest colorful color
  res.high = Object.values(palette)[0].length - 1 - skipHighest // lightest colorful color
  res.lowest = 0 // black
  res.highest = Object.values(palette)[0].length - 1 // white
  res.middle = Math.floor(res.highest / 2) + 1 // first light color
  return res
}

export class TheColor {
  constructor (name, level, palette, { skipLowest = 2, skipHighest = 1, alpha } = {}) {
    if (!palette?.[name]?.[level]) throw Error(`Color ${name} level ${level} not found in palette ${JSON.stringify(palette, null, 2)}`)

    const meta = {
      name,
      level,
      palette,
      _skipLowest: skipLowest,
      _skipHighest: skipHighest,
      ...getPaletteMeta(palette, { skipLowest, skipHighest })
    }
    if (alpha != null) meta.alpha = alpha

    Object.assign(this, meta)
  }

  clone (name, level, palette, { skipLowest, skipHighest, alpha } = {}) {
    return new TheColor(
      name ?? this.name,
      level ?? this.level,
      palette ?? this.palette,
      {
        skipLowest: skipLowest ?? this._skipLowest,
        skipHighest: skipHighest ?? this._skipHighest,
        alpha: alpha ?? this.alpha
      }
    )
  }

  toString () {
    const stringColor = this.palette[this.name][this.level]
    return this.alpha != null ? rgba(stringColor, this.alpha) : stringColor
  }

  isEqual (other) {
    return this.name === other.name && this.level === other.level && this.alpha === other.alpha
  }

  setAlpha (alpha) {
    const { name, level, palette, ...rest } = this
    return this.clone(name, level, palette, { ...rest, alpha })
  }

  isDark () { return this.level < this.middle }
  isLight () { return !this.isDark() }
  highContrast () { return this.clone(this.name, this.isDark() ? this.high : this.low) }
  stronger (offset = 1) { return this.dimmer(-offset) }
  dimmer (offset = 1) {
    if (this.isLight()) offset = -offset
    let level = this.level + offset
    level = Math.min(this.highest, Math.max(this.lowest, level))
    return this.clone(this.name, level)
  }
}

/* eslint-disable dot-notation, no-multi-spaces */
// generate meaningful colors from palette
export default function generateColors ({ existing = {}, palette, skipLowest = 2, skipHighest = 1 } = {}) {
  if (!palette) throw Error('palette is required')
  const Color = (name, level, alpha) => new TheColor(name, level, palette, { skipLowest, skipHighest, alpha })
  const { low, middle, high } = getPaletteMeta(palette, { skipLowest, skipHighest })

  // TODO: go through each color in `existing` and if it's not instanceof TheColor,
  //       then `findColorInPalette` and convert it to TheColor
  const C = { ...existing }

  // base colors
  C[ColorsEnum.bg]                              ??= Color('coolGray', high)
  C[ColorsEnum.text]                            ??= Color('coolGray', low + 1)
  C[ColorsEnum.border]                          ??= Color('coolGray', high).dimmer(2)
  C[ColorsEnum.primary]                         ??= Color('blue', middle - 1)
  C[ColorsEnum.secondary]                       ??= Color('coolGray', low + 1)
  C[ColorsEnum.error]                           ??= Color('red', middle - 1)
  C[ColorsEnum.success]                         ??= Color('green', middle)
  C[ColorsEnum.warning]                         ??= Color('yellow', middle + 2)
  C[ColorsEnum.info]                            ??= Color('cyan', middle + 1)
  C[ColorsEnum.attention]                       ??= Color('orange', middle)
  C[ColorsEnum.special]                         ??= Color('purple', middle - 1)

  // all other colors are generated from the base colors

  // main bg colors
  C[ColorsEnum['bg-primary']]                   ??= C[ColorsEnum.primary]
  C[ColorsEnum['bg-secondary']]                 ??= C[ColorsEnum.secondary]
  C[ColorsEnum['bg-error']]                     ??= C[ColorsEnum.error]
  C[ColorsEnum['bg-success']]                   ??= C[ColorsEnum.success]
  C[ColorsEnum['bg-warning']]                   ??= C[ColorsEnum.warning]
  C[ColorsEnum['bg-info']]                      ??= C[ColorsEnum.info]
  C[ColorsEnum['bg-attention']]                 ??= C[ColorsEnum.attention]
  C[ColorsEnum['bg-special']]                   ??= C[ColorsEnum.special]

  // extra bg colors
  C[ColorsEnum['bg-inverse']]                   ??= C[ColorsEnum.bg].dimmer(7)
  C[ColorsEnum['bg-inverse-transparent']]       ??= C[ColorsEnum['bg-inverse']].setAlpha(0.05)
  C[ColorsEnum['bg-dim']]                       ??= C[ColorsEnum.bg].dimmer(1)
  C[ColorsEnum['bg-dim-alt']]                   ??= C[ColorsEnum.bg].dimmer(2)
  C[ColorsEnum['bg-strong']]                    ??= C[ColorsEnum.bg].stronger(1)
  C[ColorsEnum['bg-primary-inverse']]           ??= C[ColorsEnum.primary].highContrast()
  C[ColorsEnum['bg-primary-dim']]               ??= C[ColorsEnum.primary].dimmer(3)
  C[ColorsEnum['bg-primary-transparent']]       ??= C[ColorsEnum.primary].setAlpha(0.05)
  C[ColorsEnum['bg-secondary-inverse']]         ??= C[ColorsEnum.secondary].highContrast()
  C[ColorsEnum['bg-error-inverse']]             ??= C[ColorsEnum.error].highContrast()
  C[ColorsEnum['bg-error-transparent']]         ??= C[ColorsEnum.error].setAlpha(0.05)
  C[ColorsEnum['bg-success-inverse']]           ??= C[ColorsEnum.success].highContrast()
  C[ColorsEnum['bg-success-transparent']]       ??= C[ColorsEnum.success].setAlpha(0.05)
  C[ColorsEnum['bg-warning-inverse']]           ??= C[ColorsEnum.warning].highContrast()
  C[ColorsEnum['bg-warning-transparent']]       ??= C[ColorsEnum.warning].setAlpha(0.05)
  C[ColorsEnum['bg-info-inverse']]              ??= C[ColorsEnum.info].highContrast()
  C[ColorsEnum['bg-attention-inverse']]         ??= C[ColorsEnum.attention].highContrast()
  C[ColorsEnum['bg-special-inverse']]           ??= C[ColorsEnum.special].highContrast()

  // text
  C[ColorsEnum['text-inverse']]                   ??= C[ColorsEnum.text].dimmer(8)
  C[ColorsEnum['text-description']]             ??= C[ColorsEnum.text].dimmer(2)
  C[ColorsEnum['text-placeholder']]             ??= C[ColorsEnum.text].dimmer(4)
  C[ColorsEnum['text-primary']]                 ??= C[ColorsEnum.primary]
  C[ColorsEnum['text-secondary']]               ??= C[ColorsEnum.secondary]
  C[ColorsEnum['text-error']]                   ??= C[ColorsEnum.error]
  C[ColorsEnum['text-success']]                 ??= C[ColorsEnum.success]
  C[ColorsEnum['text-warning']]                 ??= C[ColorsEnum.warning]
  C[ColorsEnum['text-info']]                    ??= C[ColorsEnum.info]
  C[ColorsEnum['text-attention']]               ??= C[ColorsEnum.attention]
  C[ColorsEnum['text-special']]                 ??= C[ColorsEnum.special]

  // extra text colors
  C[ColorsEnum['text-success-strong']]          ??= C[ColorsEnum.success].stronger(2)
  C[ColorsEnum['text-info-strong']]             ??= C[ColorsEnum.info].stronger(2)

  // text on different backgrounds
  C[ColorsEnum['text-on-primary']]              ??= C[ColorsEnum.primary].highContrast()
  C[ColorsEnum['text-on-secondary']]            ??= C[ColorsEnum.secondary].highContrast()
  C[ColorsEnum['text-on-error']]                ??= C[ColorsEnum.error].highContrast()
  C[ColorsEnum['text-on-success']]              ??= C[ColorsEnum.success].stronger(4)
  C[ColorsEnum['text-on-warning']]              ??= C[ColorsEnum.warning].stronger(3)
  C[ColorsEnum['text-on-info']]                 ??= C[ColorsEnum.info].highContrast()
  C[ColorsEnum['text-on-attention']]            ??= C[ColorsEnum.attention].stronger(4)
  C[ColorsEnum['text-on-special']]              ??= C[ColorsEnum.special].highContrast()

  // border
  C[ColorsEnum['border-strong']]                ??= C[ColorsEnum.border].stronger(3)
  C[ColorsEnum['border-primary']]               ??= C[ColorsEnum.primary]
  C[ColorsEnum['border-secondary']]             ??= C[ColorsEnum.secondary]
  C[ColorsEnum['border-error']]                 ??= C[ColorsEnum.error]
  C[ColorsEnum['border-success']]               ??= C[ColorsEnum.success]
  C[ColorsEnum['border-warning']]               ??= C[ColorsEnum.warning]
  C[ColorsEnum['border-info']]                  ??= C[ColorsEnum.info]
  C[ColorsEnum['border-attention']]             ??= C[ColorsEnum.attention]
  C[ColorsEnum['border-special']]               ??= C[ColorsEnum.special]

  // extra border colors
  C[ColorsEnum['border-inverse']]                  ??= C[ColorsEnum.border].dimmer(5)
  C[ColorsEnum['border-dim']]                   ??= C[ColorsEnum.border].dimmer(1)
  C[ColorsEnum['border-strong-alt']]            ??= C[ColorsEnum.border].stronger(1)

  return C
} /* eslint-enable dot-notation, no-multi-spaces */

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

  // Extract RGB values from RGB or RGBA string
  const extractRGB = (str) => {
    const match = str.match(/(\d+\.?\d*|\.\d+)/g) // improved regex to match decimals
    if (!match) return []
    return match.map(Number)
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
