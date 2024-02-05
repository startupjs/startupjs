import React from 'react'
import { pug, observer } from 'startupjs'
import { useHistory } from '@startupjs/app'
import { Button } from '@startupjs/ui'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import './index.styl'

export default observer(function BackButton ({ style }) {
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
})
