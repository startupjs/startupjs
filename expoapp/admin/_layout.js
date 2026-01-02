import React from 'react'
import { observer, pug } from 'startupjs'
import { Content, Br, ScrollView, Div, Span, Button, alert } from 'startupjs-ui'
import { Slot, SlotProvider } from '@startupjs/router'

export default observer(function Layout () {
  return pug`
    ScrollView(full)
      Content(padding)
        Div(row gap vAlign='center')
          Span Admin page
          SlotProvider(name='actions')
            Button(onPress=() => alert('Action 1')) Action 1
        Br
        Slot
  `
})
