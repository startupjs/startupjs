import React, { useEffect } from 'react'
import { observer, useSession, useLocal } from 'startupjs'
import { pathFor } from 'startupjs/app'
import { useMedia, Menu, Collapse } from '@startupjs/ui'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { getTitle, useLang } from '../../../../../clientHelpers'
import { useDocsContext } from '../../../../../../docsContext'
import './index.styl'

export default observer(function DocsRoot () {
  const docs = useDocsContext()
  const [lang] = useLang()
  const [path] = useLocal('$render.params.path')

  // NOTE
  // since layout renders before page loads
  // and $render is created when page loads
  // we need to wait fot the 'path' to appear
  // in the params
  if (!path) return null

  return pug`
    Docs(docs=docs lang=lang)
  `
})

const Docs = observer(function DocsComponent ({
  docs,
  lang,
  superPath,
  nestingLevel = 1
}) {
  const [path] = useLocal('$render.params.path')
  const { desktop } = useMedia()
  const [, $openedCollapses] = useSession('SidebarCollapses')
  const [, $mainSidebar] = useSession('Sidebar.mainSidebar')

  // HACK: open parent collapse on initial render
  useEffect(() => {
    if (superPath && path.startsWith(superPath)) {
      $openedCollapses.setDiff(superPath, true)
    }
  }, [])

  const menuItemStyle = { paddingLeft: nestingLevel * 24 }

  return pug`
    Menu
      each aDocName in Object.keys(docs)
        React.Fragment(key=aDocName)
          - const doc = docs[aDocName]
          - const title = getTitle(doc, lang)
          - const docPath = superPath ? superPath + '/' + aDocName : aDocName
          - const rootPath = pathFor('docs:doc', { lang, path: docPath })
          - const isActive = docPath === path
          if ['mdx', 'sandbox'].includes(doc.type)
            Menu.Item.item(
              style=menuItemStyle
              active=isActive
              to=rootPath
              onPress=desktop ? undefined : () => $mainSidebar.set(false)
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
                Docs(
                  docs=doc.items
                  superPath=docPath
                  lang=lang
                  nestingLevel=nestingLevel + 1
                )
  `
})
