import { getPaletteMeta, rgba, getPaletteLength } from './helpers'

export class TheColor {
  constructor (name, level, palette, { alpha } = {}) {
    const isBlackOrWhite = level === -1 || level === getPaletteLength(palette)

    if (!isBlackOrWhite && !palette?.[name]?.[level]) {
      throw Error(`Color ${name} level ${level} not found in palette ${JSON.stringify(palette, null, 2)}`)
    }

    const meta = {
      name,
      level,
      palette,
      ...getPaletteMeta(palette)
    }
    if (alpha != null) meta.alpha = alpha

    Object.assign(this, meta)
  }

  clone (name, level, palette, { alpha } = {}) {
    return new TheColor(
      name ?? this.name,
      level ?? this.level,
      palette ?? this.palette,
      { alpha: alpha ?? this.alpha }
    )
  }

  toString () {
    let stringColor

    if (this.level === -1) {
      stringColor = this.palette.black
    } else if (this.level === getPaletteLength(this.palette)) {
      stringColor = this.palette.white
    } else {
      stringColor = this.palette[this.name][this.level]
    }

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
    level = Math.min(this.high + 1, Math.max(this.low - 1, level))
    return this.clone(this.name, level)
  }
}
