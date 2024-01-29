import { TheColor } from './TheColor'
import { getPaletteMeta, prepareColorsObject } from './helpers'
import defaultPalette from './palette.json'

export default class Palette {
  constructor (palette = defaultPalette) {
    this.colors = palette
    if (!this.colors.secondary) this.colors.secondary = this.colors.main

    Object.assign(this, getPaletteMeta(palette))
  }

  generateColors = (overrides) => {
    const { low, high, middle } = this
    return prepareColorsObject(this.colors, this.Color, { overrides, low, middle, high })
  }

  Color = (name, level, { alpha } = {}) => {
    return new TheColor(name, level, this.colors, { alpha })
  }
}
