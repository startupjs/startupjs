import React, { useRef, useState, useEffect } from 'react'
import { View } from 'react-native'
import axios from 'axios'

// editor
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-chrome'
import './helpers/mode-startupjs'

import scope from './helpers/scope'
import wrapCode from './helpers/wrapCode'
import './index.styl'

export default function ({ value }) {
  const refEditor = useRef()
  const [code, setCode] = useState(value)
  const [jsx, setJsx] = useState(null)

  // init editor
  useEffect(() => {
    const editor = ace.edit(refEditor.current)

    editor.setOptions({
      theme: 'ace/theme/chrome',
      minLines: 2,
      maxLines: 50
    })

    editor.session.on('change', function () {
      setCode(editor.session.getValue())
    })

    editor.session.setValue(value)
    editor.session.setMode('ace/mode/startupjs')
    editor.resize(true)
  }, [])

  // code to jsx
  useEffect(() => {
    (async () => {
      try {
        let _code = code.replace(/import(.+)\n/gi, '')
        _code = wrapCode(_code)

        let tcode = await axios.post('/api/code-parse', { code: _code })
        tcode = tcode.data
        tcode += '\n return getComponent()'
        // eslint-disable-next-line
        const generator = new Function(Object.keys(scope), tcode)
        const newJsx = generator(...Object.values(scope))
        setJsx(newJsx)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [code])

  return pug`
    View.example= jsx
    View(ref=refEditor)
  `
}
