import React from 'react'
import { Modal as RNModal } from 'react-native'
import Layout from './layout'

export default function Modal ({
  style,
  visible,
  ...props
}) {
  if (!visible) return null

  return pug`
    RNModal(
      visible
      transparent
      animationType='fade'
      onRequestClose=() => { /* required prop in some platforms */ }
    )
      Layout(
        modalStyle=style
        ...props
      )
  `
}
