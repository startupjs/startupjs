import React, { useState, useMemo } from 'react'
import { pug, styl, observer, useValue, useComponentId } from 'startupjs'
import { Content, Button, Link, Div, Span } from '@startupjs/ui'

export default observer(function PPlayground () {
  const [count, setCount] = useState(0)
  const [date] = useState(Date.now())
  const [lCount, $lCount] = useValue(100)
  const componentId = useComponentId()
  const magic = useMemo(() => Math.random(), [])
  return pug`
    Content(width='mobile')
      Div(onPress=() => console.log('div 1') style={ height: 100, backgroundColor: 'red' })
      Button(onPress=() => (setCount(count + 1), $lCount.set(lCount + 1))) Button 1 - #{count} - #{lCount}
      Link(to='/playground2') Go to Playground 2
      Span
        | Hello world here again here ping 28.
        | ID: #{componentId}
        | Magic: #{magic}
        | Date: #{date}
  `
  /* eslint-disable-line */styl``
})
