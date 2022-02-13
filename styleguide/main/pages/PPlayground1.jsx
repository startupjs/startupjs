import React, { useState, useMemo, useRef } from 'react'
import { pug, styl, observer, useValue, useComponentId } from 'startupjs'
import { Content, Button, Link, Row, Span } from '@startupjs/ui'

export default observer(function PPlayground () {
  const [count, setCount] = useState(0)
  const [date] = useState(Date.now())
  const [lCount, $lCount] = useValue(100)
  const componentId = useComponentId()
  const magic = useMemo(() => Math.random(), [])
  return pug`
    Content(width='mobile')
      Sub.sub
      Button(onPress=() => (setCount(count + 1), $lCount.set(lCount + 1))) Button 1 - #{count} - #{lCount}
      Link(to='/playground2') Go to Playground 2
      Span
        | Hello world here again here ping 28.
        | ID: #{componentId}
        | Magic: #{magic}
        | Date: #{date}
  `
  /* eslint-disable-line */styl`
    .sub {
      backgroundColor red
      height 100px
    }
  `
})

const Sub = observer(() => {
  const renderRef = useRef(0)
  const [, setForceRerender] = useState()
  ++renderRef.current
  return pug`
    Row(
      part='root'
      align='center'
      vAlign='center'
      onPress=() => setForceRerender(Math.random())
    )
      Span Renders: #{renderRef.current}
  `
  /* eslint-disable-line */styl``
})
