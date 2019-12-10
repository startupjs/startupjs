import React from 'react'
import { observer } from 'startupjs'
import { Text, View } from 'react-native'
import parsePropTypes from 'parse-prop-types'
import './index.styl'

export default observer(function PComponent ({ of }) {
  const props = parsePropTypes(of)
  const entries = Object.entries(props)
  return pug`
    View.root
      Text.title Props
      each entry, index in entries
        View.entry(key=index)
          Text.label= entry[0]
          - const type = entry[1].type.name
          case type
            when 'string'
              Text TYPE STRING
  `
})
