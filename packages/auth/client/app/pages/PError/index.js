import React from 'react'
import { observer, emit, useLocal } from 'startupjs'
import { Span, Card, Button } from '@startupjs/ui'
import './index.styl'

function PError () {
  const [query] = useLocal('$render.query')
  if (!query.err) return
  return pug`
    Card.root(variant='outlined')
      Span.title= query.err
      Button.btn(onPress=() => emit('url', '/')) ◀︎  Go back
  `
}

export default observer(PError)
