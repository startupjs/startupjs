import React from 'react'
import { observer } from 'startupjs'
import TextInput from '../../components/forms/TextInput'
import Br from '../../components/Br'
import Span from '../../components/typography/Span'
import ErrorWrapper from '../../components/forms/ErrorWrapper'
import { $dialog, dialogOpen } from './helpers'

const PromptInput = observer(() => pug`
  ErrorWrapper(err=$dialog.get('textInputError'))
    TextInput(
      value=$dialog.get('textInput')
      onChangeText=t=> $dialog.set('textInput', t)
    )
`)

export default async function prompt ({
  title,
  message,
  errorMessage = 'Fill in the field',
  messageRequired = true
} = {}) {
  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  function onConfirm (e, resolve) {
    const result = $dialog.get('textInput')
    if (!result && messageRequired) {
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
