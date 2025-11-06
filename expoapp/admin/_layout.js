import React from 'react'
import { observer, pug } from 'startupjs'
import { Slot, SlotProvider } from '@startupjs/router'
import { Content, Br, Div, Span, Button, alert } from '@startupjs/ui'

export default observer(function Layout () {
  return pug`
    Content(padding)
      Div(row gap vAlign='center')
        Span Admin page
        SlotProvider(name='actions')
          Button(onPress=() => alert('Action 1')) Action 1
      Br
      Slot
  `
})
