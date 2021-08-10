import React from 'react'
import { observer, useValue } from 'startupjs'
import { Sandbox } from '@startupjs/docs'
import Checkbox from '../'

export default observer(function SandboxCheckbox () {
  const [, $props] = useValue({
    value: false,
    onChange: v => $props.set('value', v)
  })
  return pug`
    Sandbox(
      Component=Checkbox
      extraParams={
        icon: { showIconSelect: true }
      }
      $props=$props
    )
  `
})
