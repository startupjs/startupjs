import React from 'react'
import { $root, observer } from 'startupjs'
import { TextInput, Span } from '@startupjs/ui'
import { getScope } from './path'

const $dialog = getScope('dialog')
const dialogOpen = options => $dialog.set(options)
const dialogClose = () => $dialog.del()

export function alert ({ title, message }) {
  if (message && typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  dialogOpen({
    title,
    content: message,
    confirmLabel: 'Ok',
    onCancel: null,
    onConfirm: dialogClose
  })
}

export async function confirm ({
  title,
  message,
  cancelLabel,
  confirmLabel
}) {
  if (message && typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  const result = await new Promise(resolve => {
    dialogOpen({
      title,
      content: message,
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
      content: pug`
        Span(style={ marginBottom: 8 })= message
        PromptInput
      `,
      confirmLabel: 'Send',
      onConfirm: () => resolve($root.get('_session.popup.textInput'))
    })
  })

  return result
}
