import React, { useEffect, useRef } from 'react'
import * as codemirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import { View } from 'react-native'

export default function ({
  value,
  language = 'javascript'
}) {
  const ref = useRef()

  useEffect(() => {
    codemirror(ref.current, {
      lineNumbers: true,
      value,
      mode: language
    })
  }, [])

  return pug`
    View(
      ref=ref
    )
  `
}
