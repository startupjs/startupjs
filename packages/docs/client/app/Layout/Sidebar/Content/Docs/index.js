import React, { useEffect } from 'react'
import { observer, useLocal, useSession } from 'startupjs'
import { Menu, Collapse, Span } from '@startupjs/ui'
import { DEFAULT_LANGUAGE } from './../../../../../const'
import './index.styl'
import { pathFor } from 'startupjs/app'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

const Docs = observer(function DocsComponent ({
  docs,
  lang,
  subpath = '',
  children
}) {
  if (!docs) return null
  const [url] = useLocal('$render.url')
  const [, $openedCollapses] = useSession('SidebarCollapses')

  // HACK: open parent collapse
  useEffect(() => {
    if (subpath && url.includes(subpath)) $openedCollapses.setDiff(subpath, true)
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
          - const isActive = rootPath === url
          if ['mdx', 'sandbox'].includes(doc.type)
            Menu.Item(to=rootPath active=isActive)= title
          if doc.type === 'collapse'
            Collapse(
              variant='pure'
              $open=$openedCollapses.at(docPath)
            )
              Collapse.Header.collapse(
                iconPosition='right'
                icon=faAngleRight
                iconStyleName='collapse-icon'
              )
                Menu.Item(
                  to=doc.component ? rootPath : null
                  active=isActive
                )
                  Span.collapse-content= title
              Collapse.Content
                Docs(docs=doc.items lang=lang subpath=docPath)
  `
})

export default Docs
