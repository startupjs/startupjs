import React from 'react'
import { ImageBackground } from 'react-native'
import { observer, useSession } from 'startupjs'
import {
  Div,
  TextInput,
  Row,
  Span,
  Icon,
  H4
} from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import phoneImg from './phone'
import './index.styl'

function MessageBlock ({ $options }) {
  const options = $options.get()
  const [appName] = useSession('appName')

  function setField (fieldName) {
    return value => {
      $options.set(fieldName, value)
    }
  }

  return pug`
    Div
      Div.inputsBlock
        H4 Message
        TextInput.input(
          value=options.title
          placeholder='Title'
          onChangeText=setField('title')
        )
        TextInput.input(
          value=options.body
          placeholder='Content'
          onChangeText=setField('body')
        )
      Div.previewBlock
        ImageBackground.img(
          source={
            uri: phoneImg
          }
        )
          Div.previewPush
            Row.appNameBlock(vAlign='center')
              Icon(size='s' icon=faBell)
              Row.infoBlock(align='between' vAlign='center')
                Span.appName= appName ? appName : 'app name'
                Span(description) now
            if options.title
              Span.title(bold numberOfLines=1 ellipsizeMode='tail')= options.title
            Span.body(numberOfLines=2 ellipsizeMode='tail')= options.body
  `
}

MessageBlock.propTypes = {
  $options: PropTypes.any.isRequired
}

export default observer(MessageBlock)
