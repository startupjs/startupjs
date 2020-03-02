import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
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

  return ReactDOM.createPortal(
    pug`
      Layout.layout(
        styleName={visible}
        modalStyle=style
        ...props
      )
    `,
    document.getElementById(ROOT_CONTAINER_ID)
  )
}
