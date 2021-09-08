import React, { useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { ScrollView } from 'react-native'
import { observer, useValue } from 'startupjs'
import { Row, Collapse, Div, Icon } from '@startupjs/ui'
import { faCode, faCopy } from '@fortawesome/free-solid-svg-icons'
import useCodeParse from './helpers/useCodeParse'
import Editor from './Editor'
import './index.styl'

export default observer(function CodeViewer ({
  initCode,
  initJsx,
  language,
  noScroll,
  example,
  exampleOnly
}) {
  const { jsx, code, setCode } = useCodeParse({ initCode, initJsx })
  const [isRenderEditor, setIsRenderEditor] = useState(false)
  const [isShowEditor, setIsShowEditor] = useState(false)
  const [copyText, $copyText] = useValue('Copy code')

  function onShowEditor () {
    !isRenderEditor && setIsRenderEditor(true)
    setIsShowEditor(!isShowEditor)
  }

  function copyHandler () {
    Clipboard.setString(code)
    $copyText.set('Copied')
  }

  function onMouseEnter () {
    // we need to reutrn default text if it was copied
    $copyText.setDiff('Copy code')
  }

  if (!example) {
    return pug`
      Div.code
        Editor(readOnly language=language initValue=initCode)
    `
  }

  return pug`
    if noScroll
      Div.example.examplePadding= jsx
    else
      ScrollView.example(
        contentContainerStyleName=['exampleContent', 'padding']
        horizontal
      )= jsx

    if !exampleOnly
      Collapse.collapse(open=isShowEditor variant='pure')
        Collapse.Header.collapseHeader(icon=false onPress=null)
          Row(align='right')
            Div.collapseAction(
              renderTooltip=isShowEditor ? 'Hide code' : 'Show code'
              onPress=onShowEditor
            )
              Icon(icon=faCode color='error')
            Div.collapseAction(
              renderTooltip=copyText
              onPress=copyHandler
              onMouseEnter=onMouseEnter
            )
              Icon(icon=faCopy)

        Collapse.Content.collapseContent
          if isRenderEditor
            Editor(
              initValue=initCode
              onChangeCode=code=> setCode(code)
            )
  `
})
