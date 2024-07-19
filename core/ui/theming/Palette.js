import { TheColor } from './TheColor'
import { getPaletteMeta, prepareColorsObject } from './helpers'
import defaultPalette from './palette.json'

export default class Palette {
  constructor (palette = defaultPalette) {
    this.colors = palette

    Object.assign(this, getPaletteMeta(palette))
  }

  generateColors = (overrides, componentOverrides) => {
    const { low, high, middle } = this
    return prepareColorsObject(this.colors, this.Color, { overrides, componentOverrides, low, middle, high })
  }

  Color = (name, level, { alpha } = {}) => {
    return new TheColor(name, level, this.colors, { alpha })
  }
}
