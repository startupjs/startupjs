import React, { memo, useLayoutEffect, useState } from 'react'
import { Image } from 'react-native'
import { Div } from '@startupjs/ui'
import './index.styl'

export default memo(function Img ({ src }) {
  const [measured, setMeasured] = useState(false)
  const [style, setStyle] = useState()
  const [wrapperWidth, setWrapperWidth] = useState()

  const isUri = /^(http|https):\/\//.test(src)

  if (!isUri) {
    console.warn('[@startupjs/mdx] Need to provide the url for the image')
    return null
  }

  useLayoutEffect(() => {
    setSize(wrapperWidth)
  }, [wrapperWidth])

  function setSize (maxWidth) {
    Image.getSize(src, (width, height) => {
      if (maxWidth) {
        const coefficient = maxWidth / width
        setStyle({
          width: Math.min(width, maxWidth),
          height: coefficient < 1 ? Math.ceil(height * coefficient) : height
        })
        setMeasured(true)
      } else {
        setStyle({ width })
      }
    })
  }

  function onLayout (e) {
    setWrapperWidth(e.nativeEvent.layout.width)
  }

  return pug`
    if measured
      Image(
        style=style
        source={ uri: src }
        resizeMode='contain'
      )
    else
      Div.root(onLayout=onLayout)
        Image(
          style=style
          source={ uri: src }
          resizeMode='contain'
        )
  `
})
