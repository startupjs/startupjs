import React from 'react'
import { observer } from 'startupjs'
import { Modal } from '@startupjs/ui'
import { usePage } from '../../helpers'

export default observer(function Dialog () {
  const [dialog = {}, $dialog] = usePage('dialog')

  return pug`
    Modal(
      $visible=$dialog
      showCross=false
      ...dialog
    )= dialog.content
  `
})
