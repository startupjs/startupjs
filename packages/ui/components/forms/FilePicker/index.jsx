import React from 'react'
import { Platform } from 'react-native'
import { pug, observer, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import onFileSelect from './helpers/onFileSelect'
import Button from '../../Button'
import Div from '../../Div'
import themed from '../../../theming/themed'
import FilePickerDrawer from './components/FilePickerDrawer'
import './index.styl'

function FilePickerRoot ({
  style,
  title,
  drawerTitle,
  drawerStyle,
  accept,
  multiple,
  useCamera,
  useGallery,
  useFileSystem,
  size,
  buttonProps,
  onSelectFiles,
  children
}, ref) {
  const [showDrawer, $showDrawer] = useValue(false)
  const isWeb = Platform.OS === 'web'

  function _onFileSelect (options = {}) {
    onFileSelect({
      accept,
      multiple,
      onSelectFiles,
      ...options
    })
  }

  function onButtonPress () {
    if (isWeb) return _onFileSelect()
    $showDrawer.set(true)
  }

  function onHideDrawer () {
    $showDrawer.set(false)
  }

  return pug`
    FilePickerDrawer(
      style=drawerStyle
      visible=showDrawer
      title=drawerTitle
      useCamera=useCamera
      useGallery=useGallery
      useFileSystem=useFileSystem
      onDismiss=onHideDrawer
      onFileSelect=_onFileSelect
    )

    if children && typeof children !== 'string'
      Div(style=style onPress=onButtonPress)
        =children
    else
      Button(
        onPress=onButtonPress
        size=size
        style=style
        ...buttonProps
      )=title
    
  `
}

FilePickerRoot.defaultProps = {
  title: 'Select file',
  mode: 'button',
  size: 'm',
  useGallery: true,
  useCamera: true,
  useFileSystem: true,
  buttonProps: { variant: 'flat' }
}

FilePickerRoot.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  drawerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonProps: PropTypes.object,
  accept: PropTypes.string,
  title: PropTypes.string,
  drawerTitle: PropTypes.string,
  mode: PropTypes.oneOf(['button']),
  size: PropTypes.oneOf(['l', 'm', 's']),
  multiple: PropTypes.bool,
  useGallery: PropTypes.bool,
  useCamera: PropTypes.bool,
  useFileSystem: PropTypes.bool,
  onSelectFiles: PropTypes.func
}

const FilePicker = observer(
  themed('FilePicker', FilePickerRoot),
  { forwardRef: true }
)
export default FilePicker
