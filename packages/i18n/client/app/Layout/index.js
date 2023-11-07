/* eslint-disable no-unreachable */
import React from 'react'
import { pug, $root, observer, styl } from 'startupjs'
import { Layout as UILayout, Button, Row } from '@startupjs/ui'
// import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import Sidebar from './Sidebar'
import { useConfig } from './../../config'
import { useForceUpdatePageInit } from './../helpers'

export default observer(function Layout ({ children }) {
  const { langs } = useConfig({ default: false })
  const [, setForceUpdatePageInit] = useForceUpdatePageInit()
  // TODO
  // const onMenuChange = useCallback(async (value) => {
  //   switch (value) {
  //     default:
  //       alert('Not supported')
  //   }
  // }, [])

  async function save () {
    const promises = []

    for (const lang of langs) {
      const $lang = $root.scope(`i18nTranslations.${lang}`)
      const $draftLang = $root.scope(`i18nTranslations.${$lang.getDraftId()}`)
      promises.push($lang.setDiffDeep($draftLang.get()))
    }

    await Promise.all(promises)
    setForceUpdatePageInit(true)
  }

  return pug`
    UILayout
      Sidebar
        Row.header(align='right')
          Button(
            color='primary'
            variant='flat'
            onPress=save
          ) Save
          //- Dropdown(
          //-   onChange=onMenuChange
          //- )
          //-   Dropdown.Caption
          //-     Button.menu(
          //-       variant='text'
          //-       icon=faEllipsisV
          //-     )
          //-   Dropdown.Item(value='unused' label='Remove unused')
          //-   Dropdown.Item(value='import' label='Import a file')
          //-   Dropdown.Item(value='export' label='Export as file')
        = children
  `

  styl`
    .header
      padding 1u 2u
      border-bottom-width 1px
      border-bottom-color var(--color-text-placeholder)
    // .menu
    //   margin-left 1u
  `
})
