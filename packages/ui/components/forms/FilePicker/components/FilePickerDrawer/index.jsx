import { pug, observer } from 'startupjs'

import Drawer from '../../../../popups/Drawer'
import Span from '../../../../typography/Span'
import Button from '../../../../Button'

export default observer(function FileSourceDrawer ({
  style,
  visible,
  title,
  useCamera,
  useGallery,
  useFileSystem,
  onDismiss,
  onFileSelect
}) {
  function onUseCamera () {
    onFileSelect({ useCamera: true })
    onDismiss && onDismiss()
  }

  function onUseFileSystem () {
    onFileSelect()
    onDismiss && onDismiss()
  }

  function onUseGallery () {
    onFileSelect({ useGallery: true })
    onDismiss && onDismiss()
  }

  return pug`
    Drawer.root(
      style=style
      visible=visible
      position='bottom'
      onDismiss=onDismiss
    )
      if title
        Span.title(bold)=title

      if useCamera
        Button.btn(
          variant='text'
          size='l'
          onPress=onUseCamera
        ) Take photo

      if useFileSystem
        Button.btn(
          variant='text'
          size='l'
          onPress=onUseFileSystem
        ) Choose from files system
      
      if useGallery
        Button.btn(
          variant='text'
          size='l'
          onPress=onUseGallery
        ) Choose from Photo Gallery
  `
})
