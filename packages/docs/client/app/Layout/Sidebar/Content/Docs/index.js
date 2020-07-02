import React, { useEffect } from 'react'
import { observer, useSession } from 'startupjs'
import { Menu, Collapse } from '@startupjs/ui'
import { DEFAULT_LANGUAGE } from './../../../../../const'
import './index.styl'
import { pathFor, useLocation } from 'startupjs/app'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

const Docs = observer(function DocsComponent ({
  docs,
  lang,
  subpath = '',
  children,
  level = 0
}) {
  if (!docs) return null

  const { pathname } = useLocation()
  const [, $openedCollapses] = useSession('SidebarCollapses')

  // HACK: open parent collapse on initial render
  useEffect(() => {
    if (subpath) {
      const docPath = pathFor('docs:doc', { lang, path: subpath })
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
              active=isActive
              to=rootPath
              styleName={ nested: level > 0 }
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
                  active=isActive
                  to=doc.component ? rootPath : null
                  bold
                  icon=doc.icon
                )= title
              Collapse.Content
                Docs(docs=doc.items lang=lang subpath=docPath level=level + 1)
  `
})

export default Docs
