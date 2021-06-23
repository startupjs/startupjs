import React from 'react'
import { $root, observer } from 'startupjs'
import TextInput from '../components/forms/TextInput'
import Br from '../components/Br'
import Span from '../components/typography/Span'
import ErrorWrapper from '../components/forms/ErrorWrapper'
import { getScope } from './path'

const $dialog = getScope('dialog')
const dialogOpen = options => $dialog.set({ visible: true, ...options })

export async function alert ({ title, message } = {}) {
  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  const promise = await new Promise(resolve => {
    dialogOpen({
      title,
      children: message,
      cancelLabel: 'Ok',
      onDismiss: resolve
    })
  })

  return promise
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
      onDismiss: () => resolve()
    })
  })

  return result
}

const PromptInput = observer(() => pug`
  ErrorWrapper(err=$root.get('_session._ui.dialog.textInputError'))
    TextInput(
      value=$root.get('_session._ui.dialog.textInput')
      onChangeText=t=> $root.set('_session._ui.dialog.textInput', t)
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
    const result = $root.get('_session._ui.dialog.textInput')
    if (!result) {
      e.preventDefault()
      $root.set('_session._ui.dialog.textInputError', errorMessage)
    } else {
      resolve(result)
    }
  }

  function onDismiss (resolve) {
    resolve()
    $root.set('_session._ui.dialog.textInput', '')
    $root.set('_session._ui.dialog.textInputError', '')
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
      onConfirm: e => onConfirm(e, resolve),
      onDismiss: () => onDismiss(resolve)
    })
  })

  return result
}
