import React, { useCallback, useEffect, useMemo } from 'react'
import { pug, observer, useModel, useLocal } from 'startupjs'
import { pathFor } from 'startupjs/app'
import { useMedia, Menu, Collapse } from '@startupjs/ui'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { getTitle, useLang } from '../../../../../clientHelpers'
import { useDocsContext } from '../../../../../../docsContext'
import './index.styl'

const MenuItem = observer(function MenuItemComponent ({
  active,
  doc,
  docName,
  docPath,
  nestingLevel,
  superPath
}) {
  const [lang] = useLang()
  const { desktop } = useMedia()
  const $mainSidebar = useModel('_session.Sidebar.mainSidebar')
  const $openedCollapses = useModel('_session.SidebarCollapses')

  const menuItemStyle = useMemo(() => ({ paddingLeft: nestingLevel * 24 }), [nestingLevel])
  const title = useMemo(() => getTitle(doc, lang), [doc, lang])
  const rootPath = useMemo(() => pathFor('docs:doc', { lang, path: docPath }), [lang, docPath])

  if (doc.type === 'collapse') {
    return pug`
      Collapse(
        variant='pure'
        $open=$openedCollapses.at(docPath)
      )
        Collapse.Header.header(
          iconPosition='right'
          icon=faAngleRight
          iconStyleName='collapse-icon'
        )
          Menu.Item(
            style=menuItemStyle
            active=active
            to=doc.component ? rootPath : null
            bold
            icon=doc.icon
          )= title
        Collapse.Content
          Docs(
            docs=doc.items
            superPath=docPath
            nestingLevel=nestingLevel + 1
          )
    `
  }

  return pug`
    Menu.Item.item(
      style=menuItemStyle
      active=active
      to=rootPath
      onPress=desktop ? undefined : () => $mainSidebar.set(false)
    )= title
  `
})

const Docs = observer(function DocsComponent ({ docs, superPath, nestingLevel = 1 }) {
  const [path] = useLocal('$render.params.path')
  const $openedCollapses = useModel('_session.SidebarCollapses')

  // HACK: open parent collapse on initial render
  useEffect(() => {
    if (superPath && path.startsWith(superPath)) {
      $openedCollapses.setDiff(superPath, true)
    }
  }, [])

  const getDocPath = useCallback(
    docName => {
      return superPath ? superPath + '/' + docName : docName
    },
    [superPath]
  )

  const getActive = useCallback(
    docName => {
      return getDocPath(docName) === path
    },
    [path]
  )

  return pug`
    Menu
      each docName in Object.keys(docs)
        MenuItem(
          key=docName
          active=getActive(docName)
          doc=docs[docName]
          docName=docName
          docPath=getDocPath(docName)
          nestingLevel=nestingLevel
          superPath=superPath
        )
  `
})

export default observer(function DocsRoot () {
  const docs = useDocsContext()
  const [path] = useLocal('$render.params.path')

  // NOTE
  // since layout renders before page loads
  // and $render is created when page loads
  // we need to wait for the 'path' to appear
  // in the params
  if (!path) return null

  return pug`
    Docs(docs=docs)
  `
})
