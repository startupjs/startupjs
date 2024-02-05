import React from 'react'
import { pug, observer, useSession } from 'startupjs'
import {
  Div,
  TextInput,
  Span,
  Icon
} from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell'
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
        TextInput.input(
          value=options.title
          placeholder='Title'
          onChangeText=setField('title')
        )
        TextInput.input(
          value=options.body
          placeholder='Content (required)'
          onChangeText=setField('body')
        )
      Div.previewBlock
        Div.previewPush
          Div.appNameBlock(vAlign='center' row)
            Icon(size='s' icon=faBell)
            Div.infoBlock(align='between' vAlign='center' row)
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
