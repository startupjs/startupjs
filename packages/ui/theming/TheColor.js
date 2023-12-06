import { getPaletteMeta, rgba, getPaletteLength } from './helpers'

export class TheColor {
  constructor (name, level, palette, { alpha } = {}) {
    const isBlackOrWhite = this.isBlack(name, level) || this.isWhite(name, level, palette)

    if (!isBlackOrWhite && !palette?.[name]?.[level]) {
      throw Error(`Color ${name} level ${level} not found in palette ${JSON.stringify(palette, null, 2)}`)
    }

    const meta = {
      name,
      palette,
      ...getPaletteMeta(palette)
    }

    // 'black' and 'white' do not have levels
    if (level != null) meta.level = level
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

    if (this.isBlack()) {
      stringColor = this.palette.black
    } else if (this.isWhite()) {
      stringColor = this.palette.white
    } else {
      stringColor = this.palette[this.name][this.level]
    }

    return this.alpha != null ? rgba(stringColor, this.alpha) : stringColor
  }

  isEqual (other) {
    return this.name === other.name && this.level === other.level && this.alpha === other.alpha
  }

  isBlack (name = this.name, level = this.level) {
    return name === 'black' || level === -1
  }

  isWhite (name = this.name, level = this.level, palette = this.palette) {
    return name === 'white' || level === getPaletteLength(palette)
  }

  setAlpha (alpha) {
    const { name, level, palette, ...rest } = this
    return this.clone(name, level, palette, { ...rest, alpha })
  }

  isDark () { return this.level < this.middle }
  isLight () { return !this.isDark() }

  highContrast () {
    const isBlackOrWhite = this.name === 'black' || this.name === 'white'
    // since 'black' or 'white' are not arrays there is no point in cloning or changing level
    return isBlackOrWhite ? this : this.clone(this.name, this.isDark() ? this.high : this.low)
  }

  stronger (offset = 1) { return this.dimmer(-offset) }

  dimmer (offset = 1) {
    const isBlackOrWhite = this.name === 'black' || this.name === 'white'
    // since 'black' or 'white' are not arrays there is no point in cloning or changing level
    if (isBlackOrWhite) return this

    if (this.isLight()) offset = -offset
    let level = this.level + offset
    level = Math.min(this.high + 1, Math.max(this.low - 1, level))
    return this.clone(this.name, level)
  }
}
