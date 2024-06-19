import React from 'react'
import { pug, styl, observer, useValue$, useApi$, axios } from 'startupjs'
import { Slot } from '@startupjs/router'
import { Br, Item } from '@startupjs/ui'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft.js'
import { BASE_URL } from '../isomorphic/constants.js'
import Table from './Table'

export default observer(() => {
  const $files = useApi$(loadFiles)
  const $schema = useValue$()
  const $collection = useValue$()

  async function getFileSchema (filename) {
    const schema = await getFile(filename)
    if (!schema) return
    $schema.setDiffDeep(schema)
    $collection.setDiff(filename.replace(/\.[^.]+$/, ''))
  }

  return pug`
    Slot(name='sidebar')
      Br
      Item(to='..' icon=faArrowLeft) Back
      Br
      each filename, index in $files.get() || []
        Item(key=filename onPress=() => getFileSchema(filename))= filename.replace(/\.[^.]+$/, '')
    if $collection.get() && $schema.get()
      Table($schema=$schema $collection=$collection)
  `

  styl`
    .code
      white-space pre
  `
})

async function loadFiles () {
  try {
    const { data } = await axios.get(`${BASE_URL}/files`)
    if (!data) throw Error('No files found')
    return data
  } catch (err) {
    console.error(err)
  }
}

async function getFile (filename) {
  try {
    const { data } = await axios.get(`${BASE_URL}/file/${filename}`)
    if (!data) throw Error('No file found')
    return data
  } catch (err) {
    console.error(err)
  }
}
