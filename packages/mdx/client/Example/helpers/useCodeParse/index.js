import React, { useEffect, useRef, useState } from 'react'
import { Span } from '@startupjs/ui'
import axios from 'axios'
import wrapCode from './wrapCode'
import scope from './scope'

export default function useCodeParse (initCode) {
  const debounce = useRef(null)
  const [code, setCode] = useState(initCode)
  const [jsx, setJsx] = useState(null)

  // string code to jsx
  useEffect(() => {
    clearTimeout(debounce.current)
    debounce.current = setTimeout(codeParse, 200)
  }, [code.trim()])

  async function codeParse () {
    let _code = code.replace(/import(.+)\n/gi, '')
    _code = wrapCode(_code)

    const res = await axios.post('/api/code-parse', { code: _code })
    let tcode = res.data.code
    tcode += '\n return getComponent()'

    if (res.data.error) {
      setJsx(pug`
        Span(style={ color: 'red' })= res.data.error
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
