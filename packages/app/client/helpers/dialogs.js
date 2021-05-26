import React from 'react'
import { $root, observer } from 'startupjs'
import { TextInput, Span, Br } from '@startupjs/ui'
import { getScope } from './path'

const $dialog = getScope('dialog')
const dialogOpen = options => $dialog.set(options)

export function alert ({ title, message }) {
  if (message && typeof message !== 'string') {
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
}) {
  if (message && typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  const result = await new Promise(resolve => {
    dialogOpen({
      title,
      children: message,
      cancelLabel,
      confirmLabel,
      onCancel: () => resolve(false),
      onConfirm: () => resolve(true)
    })
  })

  return result
}

const PromptInput = observer(() => pug`
  TextInput(
    value=$root.get('_session.popup.textInput')
    onChangeText=t=> $root.set('_session.popup.textInput', t)
  )
`)

export async function prompt ({ title, message }) {
  if (message && typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  const result = await new Promise(resolve => {
    dialogOpen({
      title,
      children: pug`
        Span= message
        Br(half)
        PromptInput
      `,
      cancelLabel: 'Cancel',
      confirmLabel: 'Send',
      onConfirm: () => resolve($root.get('_session.popup.textInput'))
    })
  })

  return result
}
