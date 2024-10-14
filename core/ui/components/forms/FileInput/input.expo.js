import React, { useImperativeHandle } from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'
import Button from '../../Button'
import Div from '../../Div'
import themed from '../../../theming/themed'
import confirm from '../../dialogs/confirm'
import deleteFile from './deleteFile'
import uploadFile from './uploadFile'

function FileInput ({
  value: fileId,
  mimeTypes,
  image,
  uploadImmediately = true,
  beforeUpload,
  afterUpload,
  onChange,
  render
}, ref) {
  useImperativeHandle(ref, () => {
    return {
      pickFile,
      deleteFile,
      uploadFile
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

    if (beforeUpload) {
      const beforeUploadResult = beforeUpload()
      if (beforeUploadResult?.then) await beforeUploadResult
    }

    let handled
    for (const asset of assets) {
      if (handled) throw Error('Only one file is allowed')
      fileId = await uploadFile(asset, fileId)
      if (!fileId) return
      onChange(fileId)
      handled = true
    }

    if (afterUpload) {
      const afterUploadResult = afterUpload()
      if (afterUploadResult?.then) await afterUploadResult
    }
  }

  async function _deleteFile () {
    if (!await confirm('Are you sure you want to delete this file?')) return
    const deleted = await deleteFile(fileId)
    if (!deleted) return
    onChange(undefined)
  }

  function renderDefault () {
    return pug`
      if fileId
        Div(row)
          Button(onPress=pickFile) Change
          Button(pushed onPress=_deleteFile variant='text' icon=faTrashAlt)
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

FileInput.propTypes = {
  value: PropTypes.string,
  mimeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

export default observer(themed('FileInput', FileInput), { forwardRef: true })
