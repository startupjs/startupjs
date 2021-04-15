import React from 'react'
import { useSession, observer } from 'startupjs'
import { Modal, Button } from '@startupjs/ui'
import _get from 'lodash/get'
import './index.styl'

export default observer(function () {
  const [popup = {}, $popup] = useSession('popup')

  function onChange (value) {
    if (!value) $popup.set({})
  }

  function onOk () {
    const cb = _get(popup, 'actions.ok.onPress')
    if (cb) cb()
    $popup.set({})
  }

  function onCancel () {
    const cb = _get(popup, 'actions.cancel.onPress')
    if (cb) cb()
    $popup.set({})
  }

  return pug`
    Modal(
      visible=!!popup.title
      onChange=onChange
    )
      Modal.Header= popup.title
      Modal.Content= popup.content
      Modal.Actions
        if _get(popup, 'actions.cancel')
          Button.cancel(onPress=onCancel)
            = _get(popup, 'actions.cancel.text') || 'Cancel'
        Button(
          variant='flat'
          color='primary'
          onPress=onOk
        )= _get(popup, 'actions.ok.text') || 'Ok'
  `
})
