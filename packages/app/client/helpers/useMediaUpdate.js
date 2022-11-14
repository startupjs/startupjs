import { useEffect } from 'react'
import { Dimensions } from 'react-native'
import dimensions from '@startupjs/babel-plugin-rn-stylename-to-style/dimensions'
import debounce from 'lodash/debounce'

const DIMENSIONS_UPDATE_DELAY = 200

const debouncedChangeDimensions = debounce(({ window }) => {
  if (dimensions.width !== window.width) {
    console.log('> update dimensions width:', window.width)
    dimensions.width = window.width
  }
}, DIMENSIONS_UPDATE_DELAY, { leading: false, trailing: true })

export default function useMediaUpdate () {
  useEffect(() => {
    const listener = Dimensions.addEventListener('change', debouncedChangeDimensions)
    return () => {
      listener.remove()
    }
  }, [])
}
