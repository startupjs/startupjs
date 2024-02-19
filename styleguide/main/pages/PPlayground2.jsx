import React, { useState } from 'react'
import { pug, observer } from 'startupjs'
import { Content, Button, Link, Div } from '@startupjs/ui'

export default observer(function PPlayground () {
  const [count, setCount] = useState(0)
  return pug`
    Content(width='mobile')
      Div(onPress=() => console.log('div 2') style={ height: 100, backgroundColor: 'red' })
      Button(onPress=() => setCount(count + 1)) Button 2 - #{count}
      Link(to='/playground1') Go to Playground 1
  `
})
