/* eslint-disable no-unreachable */
import React, { useCallback } from 'react'
import { observer, styl } from 'startupjs'
import { Layout as UILayout, Button, Dropdown, Row } from '@startupjs/ui'
import axios from 'axios'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import Sidebar from './Sidebar'

export default observer(function Layout ({ children }) {
  const onMenuChange = useCallback(async (value) => {
    switch (value) {
      case 'unused':
        // TODO
        await axios.post('/api/i18n/remove-unused')
        break
      default:
        alert('Not supported')
    }
  }, [])

  return pug`
    UILayout
      Sidebar
        Row.header(align='right')
          //- TODO
          Button(
            color='primary'
            variant='flat'
            onPress=() => {}
          ) Save
          Dropdown(
            onChange=onMenuChange
          )
            Dropdown.Caption
              Button.menu(
                variant='text'
                icon=faEllipsisV
              )
            Dropdown.Item(value='unused' label='Remove unused')
            Dropdown.Item(value='import' label='Import a file')
            Dropdown.Item(value='export' label='Export as file')
        = children
  `

  styl`
    .header
      padding 1u 2u
      border-bottom: 1px solid $UI.colors.darkLighter
    .menu
      margin-left 1u
  `
})
