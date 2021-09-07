import React, { useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { ScrollView } from 'react-native'
import { observer, useValue } from 'startupjs'
import { Row, Collapse, Div, Icon, Loader } from '@startupjs/ui'
import { faCode, faCopy } from '@fortawesome/free-solid-svg-icons'
import useCodeParse from './helpers/useCodeParse'
import Editor from './Editor'
import './index.styl'

export default observer(function ({ initCode, language, example }) {
  const { jsx, code, setCode } = useCodeParse(initCode)
  const [isShowEditor, setIsShowEditor] = useState(false)
  const [copyText, $copyText] = useValue('Copy code')

  const { noScroll } = typeof example === 'string'
    ? JSON.parse(example)
    : {}

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
      Div.example
        Editor(
          readOnly
          language=language
          initValue=initCode
        )
    `
  }

  const jsxFallback = jsx || <Loader />

  return pug`
    if noScroll
      Div.example.examplePadding= jsxFallback
    else
      ScrollView.example(
        contentContainerStyleName=['exampleContent', 'padding']
        horizontal
      )= jsxFallback

    Collapse.collapse(open=isShowEditor variant='pure')
      Collapse.Header.collapseHeader(icon=false onPress=null)
        Row(align='right')
          Div.collapseAction(
            renderTooltip=isShowEditor ? 'Hide code' : 'Show code'
            onPress=()=> setIsShowEditor(!isShowEditor)
          )
            Icon(icon=faCode color='error')
          Div.collapseAction(
            renderTooltip=copyText
            onPress=copyHandler
            onMouseEnter=onMouseEnter
          )
            Icon(icon=faCopy)

      Collapse.Content.collapseContent
        if isShowEditor
          Editor(
            initValue=initCode
            onChangeCode=code=> setCode(code)
          )
  `
})
