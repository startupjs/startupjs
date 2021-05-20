import React from 'react'
import { ImageBackground } from 'react-native'
import { observer } from 'startupjs'
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

function MessageBlock ({ $data }) {
  const data = $data.get()

  function setField (fieldName) {
    return value => {
      $data.set(fieldName, value)
    }
  }

  return pug`
    Div
      Div.inputsBlock
        H4 Message
        TextInput.input(
          value=data.title
          placeholder='Title'
          onChangeText=setField('title')
        )
        TextInput.input(
          value=data.body
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
                Span.appName app name
                Span(description) now
            if data.title
              Span.title(bold numberOfLines=1 ellipsizeMode='tail')= data.title
            Span.body(numberOfLines=2 ellipsizeMode='tail')= data.body
  `
}

MessageBlock.propTypes = {
  $data: PropTypes.any.isRequired
}

export default observer(MessageBlock)
