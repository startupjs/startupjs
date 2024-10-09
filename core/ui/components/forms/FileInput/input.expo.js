import React, { useImperativeHandle } from 'react'
import { Platform } from 'react-native'
import { pug, observer, axios, BASE_URL } from 'startupjs'
import PropTypes from 'prop-types'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'
import Button from '../../Button'
import Div from '../../Div'
import themed from '../../../theming/themed'
import { getUploadFileUrl, getDeleteFileUrl } from './constants'
import alert from '../../dialogs/alert'
import confirm from '../../dialogs/confirm'

const isWeb = Platform.OS === 'web'

function FileInput ({
  value: fileId,
  mimeTypes,
  image,
  uploadImmediately = true,
  onChange,
  render
}, ref) {
  useImperativeHandle(ref, () => {
    return {
      pickFile,
      deleteFile,
      uploadFile: _uploadFile
    }
  }, [])

  async function pickFile () {
    let result
    if (image) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })
    } else {
      result = await DocumentPicker.getDocumentAsync({ type: mimeTypes })
    }
    const { cancelled, assets } = result
    if (cancelled || !assets) return

    if (!uploadImmediately) return assets[0]

    let handled
    for (const asset of assets) {
      if (handled) throw Error('Only one file is allowed')
      fileId = await _uploadFile(asset, fileId)
      if (!fileId) return
      onChange(fileId)
      handled = true
    }
  }

  async function deleteFile () {
    if (!await confirm('Are you sure you want to delete this file?')) return
    const deleted = await _deleteFile(fileId)
    if (!deleted) return
    onChange(undefined)
  }

  function renderDefault () {
    return pug`
      if fileId
        Div(row)
          Button(onPress=pickFile) Change
          Button(pushed onPress=deleteFile variant='text' icon=faTrashAlt)
      else
        Button(onPress=pickFile) Upload file
    `
  }

  return pug`
    if render
      = render()
    else
      = renderDefault()
  `
}

async function _uploadFile (asset, fileId) {
  try {
    const formData = new FormData()
    let type = asset.mimeType
    const name = asset.name || asset.fileName || getFilenameFromUri(asset.uri)
    if (!type) {
      if (asset.type === 'image') type = getImageMimeType(asset.uri || asset.fileName || asset.name)
    }

    if (isWeb) {
      // on web we'll receive it as a uri blob
      const blob = await (await fetch(asset.uri)).blob()
      formData.append('file', blob, name)
    } else {
      formData.append('file', {
        uri: asset.uri,
        name,
        type
      })
    }
    const res = await axios.post(BASE_URL + getUploadFileUrl(fileId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    fileId = res.data?.fileId
    if (!fileId) throw Error('File upload failed. No fileId returned from server')
    console.log('Uploaded file:', fileId)
    return fileId
  } catch (err) {
    console.error(err)
    await alert('Error uploading file')
  }
}

async function _deleteFile (fileId) {
  try {
    const res = await axios.post(BASE_URL + getDeleteFileUrl(fileId))
    fileId = res.data?.fileId
    if (!fileId) throw Error('File delete failed. No deleted fileId returned from server')
    return true
  } catch (err) {
    console.error(err)
    await alert('Error deleting file')
  }
}

function getFilenameFromUri (uri) {
  if (uri.length > 1000) return 'file' // if it's a base64 encoded uri
  return uri.split(/[/\\]/).pop().toLowerCase()
}

function getImageMimeType (filename) {
  // Extract the file extension from the filename
  const extension = filename.split('.').pop().toLowerCase()

  // Map of image extensions to MIME types
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
    ico: 'image/vnd.microsoft.icon',
    heic: 'image/heic',
    heif: 'image/heif',
    avif: 'image/avif'
  }

  // Return the corresponding MIME type or default to image/{extension}
  return mimeTypes[extension] || `image/${extension}`
}

FileInput.propTypes = {
  value: PropTypes.string,
  mimeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

export default observer(themed('FileInput', FileInput), { forwardRef: true })
