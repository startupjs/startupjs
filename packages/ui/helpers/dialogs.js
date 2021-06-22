import React from 'react'
import { $root, observer } from 'startupjs'
import { TextInput, Span, Br, ErrorWrapper } from '@startupjs/ui'
import { getScope } from './path'

const $dialog = getScope('dialog')
const dialogOpen = options => $dialog.set(options)

export function alert ({ title, message } = {}) {
  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  dialogOpen({
    title,
    children: message,
    cancelLabel: 'Ok',
    onCancel: () => {}
  })
}

export async function confirm ({
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm'
} = {}) {
  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  const result = await new Promise(resolve => {
    dialogOpen({
      title,
      children: message,
      cancelLabel,
      confirmLabel,
      onCancel: () => resolve(false),
      onConfirm: () => resolve(true),
      onBackdropPress: () => resolve()
    })
  })

  return result
}

const PromptInput = observer(() => pug`
  ErrorWrapper(err=$root.get('_session.popup.errorInput'))
    TextInput(
      value=$root.get('_session.popup.textInput')
      onChangeText=t=> $root.set('_session.popup.textInput', t)
    )
`)

export async function prompt ({
  title,
  message,
  errorMessage = 'Fill in the field'
} = {}) {
  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  function onConfirm (e, resolve) {
    $root.set('_session.popup.errorInput', '')

    const result = $root.get('_session.popup.textInput')
    if (!result) {
      e.preventDefault()
      $root.set('_session.popup.errorInput', errorMessage)
    } else {
      resolve(result)
      $root.set('_session.popup.textInput', '')
    }
  }

  const result = await new Promise(resolve => {
    dialogOpen({
      title,
      children: pug`
        Span= message
        Br(half)
        PromptInput(
          errorMessage=errorMessage
        )
      `,
      cancelLabel: 'Cancel',
      confirmLabel: 'Send',
      onCancel: () => resolve(),
      onConfirm: e => onConfirm(e, resolve),
      onBackdropPress: () => resolve()
    })
  })

  return result
}
