import cloneDeep from 'lodash/cloneDeep'
import defaultPalette from './palette.json'
import { fillColorsObject, getPaletteMeta } from './helpers'
import { TheColor } from './TheColor'

// generate meaningful colors from palette
export default function generateColors (palette, overrides = {}) {
  if (!palette) throw Error('palette is required')

  if (Array.isArray(palette.black) || Array.isArray(palette.white)) {
    throw Error("'black' and 'white' colors can't be arrays in a palette")
  }

  const paletteCopy = cloneDeep(palette)
  if (!palette.black) paletteCopy.black = defaultPalette.black
  if (!palette.white) paletteCopy.white = defaultPalette.white

  const Color = (name, level, { alpha } = {}) => new TheColor(name, level, paletteCopy, { alpha })
  const { low, middle, high } = getPaletteMeta(paletteCopy)

  const C = {}
  const P = {}

  fillColorsObject(C, P, paletteCopy, Color, { overrides, low, middle, high })

  return { colors: C, palette: P }
}
