import React from 'react'
import { observer } from 'startupjs'
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

function DeliveryConfigBlog ({ $options }) {
  const options = $options.get()

  function setPlatform (platformName) {
    if (!options.filters.platforms.includes(platformName)) {
      $options.push('filters.platforms', platformName)
    } else {
      $options.remove('filters.platforms', options.filters.platforms.indexOf(platformName))
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
              value=options.filters.platforms.includes(platform)
              onChange=() => setPlatform(platform)
            )
  `
}

DeliveryConfigBlog.propTypes = {
  $options: PropTypes.any.isRequired
}

export default observer(DeliveryConfigBlog)
