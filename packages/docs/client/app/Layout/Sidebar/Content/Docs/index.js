import React from 'react'
import { observer, useLocal, useSyncEffect, useSession } from 'startupjs'
import { Menu, Collapse } from '@startupjs/ui'
import { DEFAULT_LANGUAGE } from './../../../../../const'
import './index.styl'
import { pathFor } from 'startupjs/app'

const Docs = observer(function DocsComponent ({
  docs,
  subpath = '',
  children
}) {
  if (!docs) return null
  const [url] = useLocal('$render.url')
  const [lang] = useLocal('$render.params.lang')
  const [, $openedCollapses] = useSession('SidebarCollapses')

  useSyncEffect(() => {
    if (subpath && url.includes(subpath)) $openedCollapses.setDiff(subpath, true)
  }, [])

  function getTitle (item, lang) {
    if (!item.title) throw Error('No title specified')
    if (typeof item.title === 'string') return item.title
    if (item.title[lang]) return item.title[lang]
    return item.title[DEFAULT_LANGUAGE]
  }

  console.log('x')
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
              Collapse.Header
                Menu.Item(
                  to=doc.component ? rootPath : null
                  active=isActive
                )= title
              Collapse.Content
                Docs(docs=doc.items subpath=docPath)
  `
})

export default Docs
