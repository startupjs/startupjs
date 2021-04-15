import React from 'react'
import { $root, observer } from 'startupjs'
import { TextInput, Span } from '@startupjs/ui'
import _get from 'lodash/get'

/*
  title,
  message,
  actions: {
    ok: {
      text: 'ok',
      onPress: ()=> console.log('ok')
    },
    cancel: {
      text: 'cancel',
      onPress: ()=> console.log('cancel')
    }
  }
*/

export function alert ({
  title,
  message,
  actions
}) {
  $root.set('_session.popup', {
    title,
    content: message || '',
    actions: actions || {}
  })
}

export async function confirm ({
  title,
  message
}) {
  const result = await new Promise(resolve => {
    $root.set('_session.popup', {
      title,
      content: message,
      actions: {
        ok: {
          onPress: () => resolve(true)
        },
        cancel: {
          onPress: () => resolve(false)
        }
      }
    })
  })

  return result
}

const PromptInput = observer(({ label }) => {
  return pug`
    TextInput(
      label=label
      value=$root.get('_session.popup.textInput')
      onChangeText=t=> $root.set('_session.popup.textInput', t)
    )
  `
})

export async function prompt ({
  title,
  message,
  actions,
  label
}) {
  const result = await new Promise(resolve => {
    $root.set('_session.popup', {
      title,
      content: pug`
        Span(style={ marginBottom: 8 })= message
        PromptInput(label=label)
      `,
      actions: {
        ok: {
          text: _get(actions, 'ok.text') || 'Send',
          onPress: () => resolve($root.get('_session.popup.textInput'))
        },
        cancel: {
          text: _get(actions, 'cancel.text') || 'Cancel',
          onPress: () => $root.set('_session.popup', {})
        }
      }
    })
  })

  return result
}
