import React, { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'startupjs'
import ScrollPageContext from './Context'

export default observer(function ScrollPage ({
  children,
  ...props
}, ref) {
  const refScroll = ref || useRef()

  useEffect(() => {
    refScroll.current.scrollPosition = 0
  }, [])

  function onScroll (e) {
    refScroll.current.scrollPosition = e.nativeEvent.contentOffset.y
    props.onScroll && props.onScroll(e)
  }

  return pug`
    ScrollPageContext.Provider(value=refScroll)
      ScrollView(
        ...props
        ref=refScroll
        scrollEventThrottle=16
        onScroll=onScroll
      )= children
  `
}, { forwardRef: true })
