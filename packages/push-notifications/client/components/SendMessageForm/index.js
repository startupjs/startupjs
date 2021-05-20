import React, { useLayoutEffect } from 'react'
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

const DEFAULT_DATA = {
  title: '',
  body: '',
  allUsers: true,
  recipientIds: [],
  androidChannelId: '',
  filters: {
    platforms: []
  }
}

function SendMessageForm ({ userId, onClose }) {
  const [data, $data] = useValue({
    ...DEFAULT_DATA
  })

  useLayoutEffect(() => {
    if (!userId) return
    $data.setEach({
      recipientIds: [userId],
      allUsers: false
    })
  }, [])

  function sendCustomNotification () {
    const { recipientIds, ...options } = data

    sendNotification(recipientIds, { ...options })
    $data.setDiffDeep({
      ...DEFAULT_DATA
    })
    onClose && onClose()
  }

  return pug`
    Div
      MessageBlock($data=$data)
      DeliveryConfigBlog($data=$data)
      Button.sendButton(onPress=sendCustomNotification) Send
  `
}

SendMessageForm.defaultProps = {
  userId: ''
}

SendMessageForm.propTypes = {
  userId: PropTypes.string,
  onClose: PropTypes.func
}

export default observer(SendMessageForm)
