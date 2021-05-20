import React from 'react'
import { observer } from 'startupjs'
import {
  Div,
  TextInput,
  Row,
  Checkbox,
  H4,
  H6
} from '@startupjs/ui'
import PropTypes from 'prop-types'
import './index.styl'

const PLATFORMS = ['ios', 'android']

function DeliveryConfigBlog ({ $data }) {
  const data = $data.get()

  function setPlatform (platformName) {
    if (!data.filters.platforms.includes(platformName)) {
      $data.push('filters.platforms', platformName)
    } else {
      $data.remove('filters.platforms', data.filters.platforms.indexOf(platformName))
    }
  }

  return pug`
    Div.root
      H4 Delivery Config
      Div.platformsBlock
        H6 Platforms
        Row.platforms(vAlign='center')
          each platform, index in PLATFORMS
            Checkbox.checkbox(
              key=platform
              styleName={ first: !index }
              label=platform
              value=data.filters.platforms.includes(platform)
              onChange=() => setPlatform(platform)
            )
      if data.filters.platforms.includes('android')
        Div.androidChannelBlock
          H6 Android Channel
          TextInput.input(
            value=data.androidChannelId
            placeholder='android channel id'
            onChangeText=text => $data.set('androidChannelId', text)
          )
      Div.usersBlock
        H6 Users
        Checkbox.checkboxAllUsers(
          variant='switch'
          label='All users'
          value=data.allUsers
          onChange=value => $data.set('allUsers', value)
        )
        if !data.allUsers
          TextInput.input(
            value=data.recipientIds[0]
            placeholder='custom id'
            onChangeText=text => $data.set('recipientIds.0', text)
          )
  `
}

DeliveryConfigBlog.propTypes = {
  $data: PropTypes.any.isRequired
}

export default observer(DeliveryConfigBlog)
