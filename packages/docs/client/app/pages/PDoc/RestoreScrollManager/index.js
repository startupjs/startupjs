import React from 'react'
import { ScrollView } from 'react-native'
import { observer, useLocal } from 'startupjs'
import { useLang } from '../../../../clientHelpers'
import useRestoreScroll from './useRestoreScroll'

export default observer(function RestoreScrollManager ({
  children,
  style
}) {
  const [docPath] = useLocal('$render.params.path')
  const [lang] = useLang()
  const [anchorsOffsetY] = useLocal('_session.anchors')

  // NOTE: The main purpose of this hook is to save the scroll position
  // while writing documentation (otherwise it would jump to top on every save)
  // TODO: Scroll to anchors does not work if link using uncorrect language
  const scrollViewProps = useRestoreScroll(
    'PDoc',
    lang,
    docPath,
    JSON.stringify(anchorsOffsetY)
  )

  return pug`
    ScrollView(style=style ...scrollViewProps)= children
  `
})
