import React from 'react'
import { useValue, observer } from 'startupjs'
import { Sandbox } from '@startupjs/docs'
import Modal from '../'

export default observer(function SandboxModal () {
  const [, $props] = useValue({
    visible: false,
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
    onChange: v => $props.set('visible', v),
    onCrossPress: () => $props.set('visible', false),
    onDismiss: () => $props.set('visible', false),
    onCancel: () => $props.set('visible', false),
    onConfirm: () => $props.set('visible', false)
  })

  return pug`
    Sandbox(
      Component=Modal
      $props=$props
    )
  `
})
