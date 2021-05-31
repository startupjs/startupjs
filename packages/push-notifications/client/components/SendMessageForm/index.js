import React from 'react'
import { observer, useValue } from 'startupjs'
import {
  Div,
  Button
} from '@startupjs/ui'
import PropTypes from 'prop-types'
import { sendNotification } from '../../helpers'
import MessageBlock from './MessageBlock'
import DeliveryConfigBlog from './DeliveryConfigBlog'
import './index.styl'

const DEFAULT_OPTIONS = {
  title: '',
  body: '',
  platforms: []
}
// TODO прокидывать ади юзеров со страницы с аккаунтами с помощью чекбоксов
function SendMessageForm ({ userIds, onClose }) {
  const [options, $options] = useValue({
    ...DEFAULT_OPTIONS
  })

  async function send () {
    await sendNotification(userIds, options)
    $options.setDiffDeep({
      ...DEFAULT_OPTIONS
    })
    onClose && onClose()
  }

  return pug`
    Div
      MessageBlock($options=$options)
      DeliveryConfigBlog($options=$options)
      Button.sendButton(onPress=send) Send
  `
}

SendMessageForm.defaultProps = {
  userIds: []
}

SendMessageForm.propTypes = {
  userIds: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func
}

export default observer(SendMessageForm)
