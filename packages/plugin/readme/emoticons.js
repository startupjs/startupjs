import React, { useMemo } from 'react'
import { pug, observer } from 'startupjs'
import { alert, Div, Row, Span } from '@startupjs/ui'

export default {
  name: 'emoticons',
  defaultOptions: {
    size: 16
  },
  Faces: observer(({ love, angry, useOptions }) => {
    const { size } = useOptions()

    const emoticons = useMemo(() => {
      let emoticons = ['😀', '😃', '😄', '😁', '😅', '😆', '😂', '🤣', '😉', '😊']
      if (love) emoticons.push('😘', '😍', '🥰')
      if (angry) emoticons.push('😡', '🤬', '😈', '👿')
      return emoticons
    }, [love, angry])

    return pug`
      = renderEmoticons({ emoticons, size })
    `
  }),
  Animals: observer(({ useOptions }) => {
    const { size } = useOptions()
    const emoticons = useMemo(() => {
      return [
        '🐰', '🐱', '🦊', '🐭', '🐶', '🐒', '🐿', '🐮', '🐻', '🐼',
        '🦁', '🐺', '🐷', '🦧', '🦥', '🐅', '🦓', '🦘', '🐖', '🐩'
      ]
    }, [])

    return renderEmoticons({ emoticons, size })
  })
}

function renderEmoticons ({ emoticons, size }) {
  const style = { fontSize: size, lineHeight: size }

  return pug`
    Row(wrap)
      each emoticon, index in emoticons
        Div(
          key=index
          style={
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 8
          }
          variant='highlight'
          onPress=() => alert({ message: 'Emoticon ' + emoticon + ' is pressed' })
        )
          Span(style=style)= emoticon
    `
}
