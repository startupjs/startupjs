import React, { useMemo } from 'react'
import { pug, observer, useValue } from 'startupjs'
import {
  Div,
  Button
} from '@startupjs/ui'
import PropTypes from 'prop-types'
import { sendNotification } from '../../helpers'
import MessageBlock from './MessageBlock'
import DeliveryConfigBlock from './DeliveryConfigBlock'
import './index.styl'

function SendMessageForm ({ userIds, onClose }) {
  const [options, $options] = useValue({})

  async function send () {
    await sendNotification(userIds, options)
    $options.set({})
    onClose && onClose()
  }

  const disabled = useMemo(() => {
    return !options.body || !options.platforms || !options.platforms.length
  }, [JSON.stringify(options)])

  return pug`
    Div
      MessageBlock($options=$options)
      Div.config
        DeliveryConfigBlock($options=$options)
      Button.sendButton(disabled=disabled onPress=send) Send
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
