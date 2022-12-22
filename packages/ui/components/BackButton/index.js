import React from 'react'
import { observer } from 'startupjs'
import { useHistory } from '@startupjs/app'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import themed from '../../theming/themed'
import './index.styl'

function BackButton ({ style }) {
  const history = useHistory()

  return pug`
    Button.backButton(
      icon=faArrowLeft
      size='m'
      variant='text'
      style=style
      onPress=() => history.goBack()
    ) 
  `
}

BackButton.defaultProps = {}

BackButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

export default observer(themed('BackButton', BackButton))
