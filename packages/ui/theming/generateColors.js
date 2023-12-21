import { prepareColorsObject, getPaletteMeta } from './helpers'
import { TheColor } from './TheColor'

// generate meaningful colors from palette
export default function generateColors (palette, overrides = {}) {
  if (!palette) throw Error('palette is required')

  const Color = (name, level, { alpha } = {}) => new TheColor(name, level, palette, { alpha })
  const { low, middle, high } = getPaletteMeta(palette)

  return prepareColorsObject(palette, Color, { overrides, low, middle, high })
}
