import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Span } from '@startupjs/ui'
import axios from 'axios'
import _merge from 'lodash/merge'
import wrapCode from './wrapCode'
import scope from './scope'

// eslint-disable-next-line
const REGEX_ANSI = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g

export default function useCodeParse ({ initCode, initJsx, globals }) {
  const debounce = useRef(null)
  const isFirstRender = useRef(false)
  const [code, setCode] = useState(initCode)
  const [jsx, setJsx] = useState(initJsx)

  const _globals = useMemo(() => _merge(scope, globals), [])

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
      const generator = new Function(Object.keys(_globals), tcode)
      const newJsx = generator(...Object.values(_globals))
      setJsx(newJsx)
    }
  }

  return { jsx, code, setCode }
}
