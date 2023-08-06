import React, { useState, useMemo, useRef } from 'react'
// TODO: Test useDoc$ and useQuery$
import { pug, styl, observer, useComponentId, $, /* useDoc$, useQuery$, */ useValue$ } from 'startupjs'
import { Br, Div, Content, Button, Link, Row, Span, Card, H5 } from '@startupjs/ui'

export default observer(function PPlayground () {
  const [count, setCount] = useState(0)
  const [date] = useState(Date.now())

  const $magicCounter = useValue$({ value: 100 })
  const { $foo } = $.session

  const componentId = useComponentId()
  const magic = useMemo(() => Math.random(), [])

  function onPress () {
    setCount(count + 1)
    const { $value } = $magicCounter
    $value.set($value.get() + 1)
  }

  return pug`
    Div.page
      Content(width='mobile')
        Br
        Button(onPress=onPress) Button 1 - #{count} - #{$magicCounter.value.get()}
        Br
        Span #{$foo.number.path()} value: #{$foo.number.get()}
        Br
        Sub($value=$magicCounter.value $foo=$foo style={ backgroundColor: 'cyan', height: 100 } title='Sub inline styles')
        Br
        Sub.sub($value=$magicCounter.value $foo=$foo title='Sub class styles')
        Br
        Link(to='/playground2') Go to Playground 2
        Span
          | Hello world here again here ping 28.
          | ID: #{componentId}
          | Magic: #{magic}
          | Date: #{date}
  `
  /* eslint-disable-line */styl`
    .page
      background-color #f2f2f2
      height 100vh

    .sub
      backgroundColor lime
      height 100px
  `
})

const Sub = observer(({ $value, $foo, title }) => {
  const renderRef = useRef(0)
  const [, setForceRerender] = useState()
  const { $number } = $foo
  ++renderRef.current

  return pug`
    Card
      H5= title
      Button(onPress=() => $value.set($value.get() + 1)) Increase magicCounter.value from Sub
      Br
      Button(onPress=() => $number.set(~~$number.get() + 1)) Increment #{$number.path()} as Signal
      Br
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
