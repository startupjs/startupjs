import React, { useEffect, useState } from 'react'
import { observer, u, useModel } from 'startupjs'
import { pathFor, useLocation } from 'startupjs/app'
import { AutoSuggest, Button, Div, Layout, Menu, Row, Span } from '@startupjs/ui'
import { MDXProvider } from '@startupjs/mdx'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Sidebar, { SIDEBAR_PATH } from './Sidebar'
import { useDocsContext } from '../../../docsContext'
import { useLang, getTitle } from '../../clientHelpers'
import './index.styl'

function getItems (item, lang, subpath) {
  const docKey = item[0]
  const docPath = subpath ? `${subpath}/${docKey}` : docKey
  const rootPath = pathFor('docs:doc', { lang, path: docPath })
  if (item[1].items) {
    return Object.entries(item[1].items).reduce((acc, item) => {
      return [...acc, ...getItems(item, lang, docPath)]
    }, [])
  } else {
    return [{
      value: rootPath,
      label: getTitle(item[1], lang)
    }]
  }
}

function renderItem (item, path) {
  const active = item.value === path
  return pug`
    Menu.Item(
      key=item.value
      to=item.value
    )
      Span(
        styleName={active}
        numberOfLines=1
      )= item.label
  `
}

const Search = observer(function Search () {
  const [value, setValue] = useState({})
  const [found, setFound] = useState(-1)
  const { pathname } = useLocation()
  const docs = useDocsContext()
  const [lang] = useLang()

  useEffect(() => {
    setValue({})
  }, [pathname])

  const options = Object.entries(docs).reduce((acc, item) => {
    return [...acc, ...getItems(item, lang)]
  }, [])

  // TODO: remove after fixing Slicer height in AutoSuggest
  function onChangeText (value) {
    setFound(options.filter((item) => {
      return item.label.match(new RegExp('^' + value, 'gi'))
    }).length)
  }
  const style = {}
  if ((found === -1 && options.length > 10) || found > 10) style.height = u(20)

  return pug`
    AutoSuggest.search(
      style=style
      value=value
      options=options
      placeholder='Search...'
      renderItem= item => renderItem(item, pathname)
      onChangeText=onChangeText
    )
  `
})

const Topbar = observer(function Topbar () {
  const $open = useModel(SIDEBAR_PATH)

  function toggleSidebar () {
    $open.set(!$open.get())
  }

  return pug`
    Row.topbar
      Button(testID='button' icon=faBars onPress=toggleSidebar color='darkLight')
      Div.searchWrapper
        Search
  `
})

export default observer(function StyleguideLayout ({ children }) {
  // Note: Topbar height is compensated in PDoc
  //       to achieve a semi-transparent effect
  return pug`
    MDXProvider
      Layout.layout(testID="Layout")
        Sidebar
          Topbar
          = children
  `
})
