import React, { useEffect } from 'react'
import { observer, useSession } from 'startupjs'
import { pathFor, useLocation } from 'startupjs/app'
import { Menu, Collapse } from '@startupjs/ui'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { DEFAULT_LANGUAGE } from './../../../../../const'
import { useLang } from '../../../../../clientHelpers'
import './index.styl'

const Docs = observer(function DocsComponent ({
  docs,
  subpath = '',
  children,
  level = 1
}) {
  if (!docs) return null
  const [lang] = useLang()
  const { pathname } = useLocation()
  const [, $openedCollapses] = useSession('SidebarCollapses')

  // HACK: open parent collapse on initial render
  useEffect(() => {
    if (subpath) {
      const docPath = pathFor('docs:doc', { path: subpath })
      if (pathname.startsWith(docPath)) $openedCollapses.setDiff(subpath, true)
    }
  }, [])

  function getTitle (item, lang) {
    const title = item.title
      ? typeof item.title === 'string'
        ? item.title
        : item.title[lang] || item.title[DEFAULT_LANGUAGE]
      : null
    if (!title) throw Error('No title specified')
    return title
  }

  const menuItemStyle = { paddingLeft: level * 24 }

  return pug`
    Menu
      each aDocName in Object.keys(docs)
        React.Fragment(key=aDocName)
          - const doc = docs[aDocName]
          - const title = getTitle(doc, lang)
          - const docPath = subpath ? subpath + '/' + aDocName : aDocName
          - const rootPath = pathFor('docs:doc', { lang, path: docPath })
          - const isActive = rootPath === pathname
          if ['mdx', 'sandbox'].includes(doc.type)
            Menu.Item.item(
              style=menuItemStyle
              active=isActive
              to=rootPath
            )= title
          if doc.type === 'collapse'
            Collapse(
              variant='pure'
              $open=$openedCollapses.at(docPath)
            )
              Collapse.Header.header(
                iconPosition='right'
                icon=faAngleRight
                iconStyleName='collapse-icon'
              )
                Menu.Item.item(
                  style=menuItemStyle
                  active=isActive
                  to=doc.component ? rootPath : null
                  bold
                  icon=doc.icon
                )= title
              Collapse.Content
                Docs(docs=doc.items subpath=docPath level=level + 1)
  `
})

export default Docs
