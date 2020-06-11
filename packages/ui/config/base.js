import variables from './variables'
import shadows from './shadows'
import PALLETE from './pallete.json'
import generateColorsFromPalette from './generateColorsFromPalette'

export default function (pallete = PALLETE) {
  return {
    pallete,
    shadows,
    colors: generateColorsFromPalette(pallete),
    ...variables
  }
}
