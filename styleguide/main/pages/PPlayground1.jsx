import React, { useState, useMemo, useRef } from 'react'
import { pug, styl, observer, useValue, useComponentId } from 'startupjs'
import { Content, Button, Link, Div, Span, Card, H5 } from '@startupjs/ui'

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
      Sub($value=$magicCounter.at('value') style={ backgroundColor: 'red', height: 100 } title='Sub inline styles')
      Sub.sub($value=$magicCounter.at('value') title='Sub class styles')
      Button(onPress=onPress) Button 1 - #{count} - #{magicCounter.value}
      Link(to='/playground2') Go to Playground 2
      Span
        | Hello world here again here ping 28.
        | ID: #{componentId}
        | Magic: #{magic}
        | Date: #{date}
  `
  styl`
    .sub {
      backgroundColor red
      height 100px
    }
  `
})

const Sub = observer(({ $value, title }) => {
  const renderRef = useRef(0)
  const [, setForceRerender] = useState()
  ++renderRef.current
  return pug`
    Card
      H5= title
      Button(onPress=() => $value.set($value.get() + 1)) Increase magicCounter.value from Sub
      Sub2($value=$value)
      Div(
        row
        part='root'
        align='center'
        vAlign='center'
        onPress=() => {
          setForceRerender(Math.random())
        }
      )
        Span Renders: #{renderRef.current}.
  `
})

const Sub2 = observer(({ $value }) => {
  return pug`
    Span Sub2 magicCounter.value: #{ $value.get() }
  `
})
