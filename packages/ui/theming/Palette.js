import { TheColor } from './TheColor'
import { getPaletteMeta, fillColorsObject } from './helpers'
import defaultPalette from './palette.json'

export default class Palette {
  constructor (palette = defaultPalette) {
    this.colors = palette

    Object.assign(this, getPaletteMeta(palette))
  }

  generateColors = (overrides) => {
    const C = {}
    const P = {}

    const { low, high, middle } = this
    fillColorsObject(C, P, this.colors, this.Color, { overrides, low, middle, high })

    return { colors: C, palette: P }
  }

  Color = (name, level, { alpha } = {}) => {
    return new TheColor(name, level, this.colors, { alpha })
  }
}
