import React from 'react'
import { pug, observer } from 'startupjs'
import {
  Div,
  Row,
  Checkbox,
  H4,
  H6
} from '@startupjs/ui'
import PropTypes from 'prop-types'
import './index.styl'

const PLATFORMS = ['ios', 'android']

function DeliveryConfigBlock ({ $options }) {
  const options = $options.get()

  function setPlatform (platformName) {
    if (!options.platforms || !options.platforms.includes(platformName)) {
      $options.push('platforms', platformName)
    } else {
      $options.remove('platforms', options.platforms.indexOf(platformName))
    }
  }

  return pug`
    Div
      H4 Delivery Config
      Div.platformsBlock
        H6 Platforms
        Row.platforms(vAlign='center')
          each platform, index in PLATFORMS
            Checkbox.checkbox(
              key=platform
              styleName={ first: !index }
              label=platform
              value=options.platforms ? options.platforms.includes(platform) : false
              onChange=() => setPlatform(platform)
            )
  `
}

DeliveryConfigBlock.propTypes = {
  $options: PropTypes.any.isRequired
}

export default observer(DeliveryConfigBlock)
