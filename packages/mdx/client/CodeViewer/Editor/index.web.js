import React, { useRef, useEffect } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import ace from 'ace-builds/src-noconflict/ace'
import prepareLanguage from '../helpers/prepareLanguage'

// editor
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/mode-jade'
import 'ace-builds/src-noconflict/mode-stylus'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-text'
import '../helpers/mode-startupjs'

function Editor ({
  initValue,
  language = '',
  readOnly,
  onChangeCode
}) {
  const refEditor = useRef()

  // init editor
  useEffect(() => {
    const editor = ace.edit(refEditor.current)

    editor.setOptions({
      theme: 'ace/theme/chrome',
      minLines: 2,
      maxLines: 25,
      value: initValue,
      resize: true,
      showPrintMargin: false
    })

    if (readOnly) {
      editor.setOption('minLines', 1)
      editor.setReadOnly(true)
      editor.setHighlightActiveLine(false)
      editor.setHighlightGutterLine(false)
      editor.setOption('showGutter', false)
      editor.container.style.background = '#f5f5f5'
      editor.renderer.$cursorLayer.element.style.display = 'none'
      editor.setOption('mode', `ace/mode/${prepareLanguage(language)}`)
    } else {
      editor.container.style.background = '#efefef'
      editor.setOption('mode', 'ace/mode/startupjs')
    }

    editor.session.on('change', function () {
      const code = editor.session.getValue()
      onChangeCode(code)
    })
  }, [])

  return pug`
    View(ref=refEditor)
  `
}

export default observer(Editor)
