import React, { useState, useMemo, useRef } from 'react'
import { pug, styl, observer, useValue, useComponentId } from 'startupjs'
import { Content, Button, Link, Row, Span } from '@startupjs/ui'

export default observer(function PPlayground () {
  const [count, setCount] = useState(0)
  const [date] = useState(Date.now())
  const [magicCounter, $magicCounter] = useValue({ value: 100 })
  const componentId = useComponentId()
  const magic = useMemo(() => Math.random(), [])

  function onPress () {
    setCount(count + 1)
    $magicCounter.set('value', magicCounter.value + 1)
  }

  return pug`
    Content(width='mobile')
      Sub.sub($value=$magicCounter.at('value'))
      Button(onPress=onPress) Button 1 - #{count} - #{magicCounter.value}
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

const Sub = observer(({ $value }) => {
  const renderRef = useRef(0)
  const [, setForceRerender] = useState()
  ++renderRef.current
  return pug`
    Button(onPress=() => $value.set($value.get() + 1)) Increase magicCounter.value from Sub
    Sub2($value=$value)
    Row(
      part='root'
      align='center'
      vAlign='center'
      onPress=() => {
        setForceRerender(Math.random())
      }
    )
      Span Renders: #{renderRef.current}.
  `
  /* eslint-disable-line */styl``
})

const Sub2 = observer(({ $value }) => {
  return pug`
    Span Sub2 magicCounter.value: #{ $value.get() }
  `
  /* eslint-disable-line */styl``
})
