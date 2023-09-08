import { useCallback } from 'react'
import singletonVariables from '@startupjs/babel-plugin-rn-stylename-to-style/variables'
import STYLES from './useColors.styl'

const { staticColors } = STYLES

export default function useColors () {
  return useCallback(getColor, [])
}

function getColor (color) {
  const cssVar = `--colors-${color}`
  return singletonVariables[cssVar] || staticColors[color]
}
