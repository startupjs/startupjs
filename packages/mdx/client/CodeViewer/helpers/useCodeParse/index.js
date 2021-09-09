import React, { useEffect, useRef, useState } from 'react'
import { Span } from '@startupjs/ui'
import axios from 'axios'
import wrapCode from './wrapCode'
import scope from './scope'

// eslint-disable-next-line
const REGEX_ANSI = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g

export default function useCodeParse ({ initCode, initJsx }) {
  const debounce = useRef(null)
  const isFirstRender = useRef(false)
  const [code, setCode] = useState(initCode)
  const [jsx, setJsx] = useState(initJsx)

  // string code to jsx
  useEffect(() => {
    if (!isFirstRender.current) {
      isFirstRender.current = true
    } else {
      clearTimeout(debounce.current)
      debounce.current = setTimeout(codeParse, 200)
    }
  }, [code.trim()])

  async function codeParse () {
    let _code = code.replace(/import(.+)\n/gi, '')
    _code = wrapCode(_code)

    const res = await axios.post('/api/code-parse', { code: _code })
    let tcode = res.data.code
    tcode += '\n return getComponent()'

    if (res.data.error) {
      setJsx(pug`
        Span(style={ color: 'red', fontFamily: 'monospace' })
          = res.data.error.replace(REGEX_ANSI, '')
      `)
    } else {
      // eslint-disable-next-line
      const generator = new Function(Object.keys(scope), tcode)
      const newJsx = generator(...Object.values(scope))
      setJsx(newJsx)
    }
  }

  return { jsx, code, setCode }
}
