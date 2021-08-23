import React, { useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { ScrollView } from 'react-native'
import { observer, useValue } from 'startupjs'
import { Row, Collapse, Tooltip, Div, Icon } from '@startupjs/ui'
import { faCode, faCopy } from '@fortawesome/free-solid-svg-icons'
import useCodeParse from './helpers/useCodeParse'
import Editor from './Editor'
import './index.styl'

export default observer(function ({ value, noScroll }) {
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
    if noScroll
      Div.example.examplePadding= jsx
    else
      ScrollView.example(
        contentContainerStyleName=['exampleContent', 'padding']
        horizontal
      )= jsx

    Collapse.collapse(open=isShowEditor variant='pure')
      Collapse.Header.collapseHeader(icon=false onPress=null)
        Row(align='right')
          Tooltip.collapseAction(content=isShowEditor ? 'Hide code' : 'Show code')
            Div(onPress=()=> setIsShowEditor(!isShowEditor))
              Icon(icon=faCode color='error')
          Tooltip.collapseAction(content=copyText)
            Div(
              onPress=copyHandler
              onMouseEnter=onMouseEnter
            )
              Icon(icon=faCopy)

      Collapse.Content.collapseContent
        Editor(
          initValue=value
          onChangeCode=code=> setCode(code)
        )
  `
})
