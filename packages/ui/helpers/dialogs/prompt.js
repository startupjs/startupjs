import React from 'react'
import { observer } from 'startupjs'
import Input from '../../components/forms/Input'
import Br from '../../components/Br'
import Span from '../../components/typography/Span'
import { $dialog, dialogOpen } from './helpers'

const PromptInput = observer(() => pug`
  Input(
    err=$dialog.get('textInputError')
    type='text'
    value=$dialog.get('textInput')
    onChangeText=t=> $dialog.set('textInput', t)
  )
`)

export default async function prompt ({
  title,
  message,
  errorMessage = 'Fill in the field',
  required = true
} = {}) {
  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  function onConfirm (e, resolve) {
    const result = $dialog.get('textInput')
    if (!result && required) {
      e.preventDefault()
      $dialog.set('textInputError', errorMessage)
    } else {
      resolve(result)
    }
  }

  function onDismiss (resolve) {
    resolve()
    $dialog.set('textInput', '')
    $dialog.set('textInputError', '')
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
