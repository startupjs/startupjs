import React from 'react'
import { View, Text } from 'react-native'
import { useHistory } from 'react-router-native'
import { observer } from 'startupjs'
import { defaultTemplates } from './templates'
import './index.styl'

export default observer(function Error ({ value, pages = {}, disableError }) {
  // TODO: Need to make the default layout better
  const history = useHistory()
  const status = parseInt(value)
  const Template = pages[status] || defaultTemplates[status]
  return pug`
    View.root
      if Template
        Template(
          goBack=()=>history.goBack()
          disableError=disableError
        )
      else
        Text.title Error
        Text
          Text= 'Sorry, something went wrong. Please '
          Text.back(onPress=() => {
            history.goBack()
          }) go back
          Text= ' and try again.'
  `
})
