import React, { useRef, useEffect } from 'react'
import { View } from 'react-native'

// editor
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/mode-jade'
import 'ace-builds/src-noconflict/mode-stylus'
import 'ace-builds/src-noconflict/mode-javascript'
import '../helpers/mode-startupjs'

export default function ({ initValue, readOnly, onChangeCode }) {
  const refEditor = useRef()

  // init editor
  useEffect(() => {
    const editor = ace.edit(refEditor.current)

    editor.setOptions({
      theme: 'ace/theme/chrome',
      mode: 'ace/mode/startupjs',
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
    }

    editor.container.style.background = '#efefef'

    editor.session.on('change', function () {
      const code = editor.session.getValue()
      onChangeCode(code)
    })
  }, [])

  return pug`
    View(ref=refEditor)
  `
}
