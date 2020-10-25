import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { View } from 'react-native'
import Layout from './layout'
import './index.styl'
const ROOT_CONTAINER_ID = 'app'

export default function Modal ({
  style,
  visible,
  onShow,
  ...props
}) {
  useEffect(() => {
    if (visible && onShow) onShow()
  }, [visible])

  if (!visible) return null

  if (props.variant === 'pure') {
    return ReactDOM.createPortal(
      pug`
        View.pure(
          style=style
        )
          = props.children
      `,
      document.getElementById(ROOT_CONTAINER_ID)
    )
  }

  return ReactDOM.createPortal(
    pug`
      Layout(
        modalStyle=style
        ...props
      )
    `,
    document.getElementById(ROOT_CONTAINER_ID)
  )
}
