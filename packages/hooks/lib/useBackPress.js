import { useCallback, useRef, useEffect } from 'react'
import { emit } from '@startupjs/react-sharedb'
import { BackHandler } from 'react-native'

export default function useBackPress (back) {
  if (!back) throw new Error('[useBackPress] Missing back parameter')

  const previousHandler = useRef()

  const onBackPress = useCallback(function () {
    if (typeof back === 'function') {
      return back(BackHandler)
    } else if (typeof back === 'string') {
      emit('url', back)
      return true
    } else {
      console.error('[useBackPress] Unsupported back parameter type', back)
    }
  }, [back])

  useEffect(() => {
    if (previousHandler.current) {
      BackHandler.removeEventListener('hardwareBackPress', previousHandler.current)
    }
    previousHandler.current = onBackPress
    BackHandler.addEventListener('hardwareBackPress', onBackPress)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }
  }, [onBackPress])
}
