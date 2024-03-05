import React from 'react'
import { pug, observer, axios } from 'startupjs'
import PropTypes from 'prop-types'
import * as DocumentPicker from 'expo-document-picker'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'
import Button from '../../Button'
import Div from '../../Div'
import themed from '../../../theming/themed'
import { getUploadFileUrl, getDeleteFileUrl } from './constants'
import alert from '../../dialogs/alert'
import confirm from '../../dialogs/confirm'

function FileInput ({
  value: fileId,
  mimeTypes,
  onChange
}) {
  async function pickFile () {
    const { cancelled, assets } = await DocumentPicker.getDocumentAsync({ type: mimeTypes })
    if (cancelled || !assets) return
    let handled
    for (const asset of assets) {
      if (handled) throw Error('Only one file is allowed')
      fileId = await _uploadFile(asset.file, fileId)
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

  return pug`
    if fileId
      Div(row)
        Button(onPress=pickFile) Change
        Button(pushed onPress=deleteFile variant='text' icon=faTrashAlt)
    else
      Button(onPress=pickFile) Upload file
  `
}

async function _uploadFile (file, fileId) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post(getUploadFileUrl(fileId), formData, {
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
    const res = await axios.post(getDeleteFileUrl(fileId))
    fileId = res.data?.fileId
    if (!fileId) throw Error('File delete failed. No deleted fileId returned from server')
    return true
  } catch (err) {
    console.error(err)
    await alert('Error deleting file')
  }
}

FileInput.propTypes = {
  value: PropTypes.string,
  mimeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

export default observer(themed('FileInput', FileInput))
