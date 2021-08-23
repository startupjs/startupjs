import React, { useState } from 'react'
import { View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { observer, useValue } from 'startupjs'
import { Row, Collapse, Tooltip, Div, Icon } from '@startupjs/ui'
import { faCode, faCopy } from '@fortawesome/free-solid-svg-icons'
import useCodeParse from './helpers/useCodeParse'
import Editor from './Editor'
import './index.styl'

export default observer(function ({ value }) {
  const { jsx, code, setCode } = useCodeParse(value)
  const [isShowEditor, setIsShowEditor] = useState(false)
  const [copyText, $copyText] = useValue('Copy code')

  function copyHandler () {
    Clipboard.setString(code)
    $copyText.set('Copied')
  }

  function onMouseEnter () {
    // we need to reutrn default text if it was copied
    $copyText.setDiff('Copy code')
  }

  return pug`
    View.example= jsx

    Collapse.collapse(open=isShowEditor variant='pure')
      Collapse.Header.collapseHeader(icon=false onPress=null)
        Row(align='right')
          Tooltip(content=isShowEditor ? 'Hide code' : 'Show code')
            Div.collapseAction(onPress=()=> setIsShowEditor(!isShowEditor))
              Icon.collapseIcon(icon=faCode color='error')
          Tooltip(content=copyText)
            Div.collapseAction(
              onPress=copyHandler
              onMouseEnter=onMouseEnter
            )
              Icon.collapseIcon(icon=faCopy)

      Collapse.Content.collapseContent
        Editor(
          initValue=value
          onChangeCode=code=> setCode(code)
        )
  `
})
