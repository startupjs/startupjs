import Palette from './Palette'

export default function generateColors (palette, overrides) {
  return new Palette(palette).generateColors(overrides)
}
