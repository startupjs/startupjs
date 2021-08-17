import React from 'react'
import { useValue, observer } from 'startupjs'
import { Sandbox } from '@startupjs/docs'
import Multiselect from '../'

export default observer(function MultiSelectSandbox () {
  const [, $props] = useValue({
    value: ['New York'],
    options: ['New York', 'Los Angeles', 'Tokyo'],
    onChange: v => $props.set('value', v),
    onSelect: value => alert('Value ' + value + ' is selected'),
    onRemove: value => alert('Value ' + value + ' is removed')
  })
  return pug`
    Sandbox(
      Component=Multiselect
      $props=$props
    )
  `
})
