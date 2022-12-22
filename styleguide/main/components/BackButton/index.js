import React from 'react'
import { observer } from 'startupjs'
import { useHistory } from '@startupjs/app'
import { Button } from '@startupjs/ui'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
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
