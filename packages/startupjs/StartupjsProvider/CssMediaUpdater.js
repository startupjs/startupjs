import { memo, useCallback, useRef } from 'react'
import { useWindowDimensions } from 'react-native'
import dimensions from '@startupjs/babel-plugin-rn-stylename-to-style/dimensions'
import debounce from 'lodash/debounce'

const DEFAULT_UPDATE_DELAY = 200

export default memo(function CssMediaUpdater ({ updateDelay = DEFAULT_UPDATE_DELAY }) {
  const widthRef = useRef()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateWidth = useCallback(
    debounce(width => {
      if (dimensions.width !== width) {
        console.log('> update window width:', width)
        dimensions.width = width
      }
    }, updateDelay, { leading: false, trailing: true }),
    []
  )
  const { width } = useWindowDimensions()
  if (widthRef.current == null) {
    widthRef.current = width
    dimensions.width = width
  } else if (widthRef.current !== width) {
    widthRef.current = width
    updateWidth(width)
  }
  return null
})
