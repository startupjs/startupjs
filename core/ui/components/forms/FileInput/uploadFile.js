import { Platform } from 'react-native'
import { axios, BASE_URL } from 'startupjs'
import alert from '../../dialogs/alert'
import { getUploadFileUrl } from './constants'

const isWeb = Platform.OS === 'web'

export default async function uploadFile (asset, fileId) {
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
