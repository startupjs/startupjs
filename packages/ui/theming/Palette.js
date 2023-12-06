import cloneDeep from 'lodash/cloneDeep'
import { TheColor } from './TheColor'
import { getPaletteMeta, fillColorsObject } from './helpers'
import defaultPalette from './palette.json'

export default class Palette {
  constructor (palette = defaultPalette) {
    if (Array.isArray(palette.black) || Array.isArray(palette.white)) {
      throw Error("'black' and 'white' colors can't be arrays in a palette")
    }

    const paletteCopy = cloneDeep(palette)
    if (!palette.black) paletteCopy.black = defaultPalette.black
    if (!palette.white) paletteCopy.white = defaultPalette.white

    this.colors = paletteCopy

    Object.assign(this, getPaletteMeta(paletteCopy))
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
