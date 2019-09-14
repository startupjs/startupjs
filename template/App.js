import React, { memo } from 'react'
import {
  View,
  Text
} from 'react-native'

import './App.styl'

export default function App () {
  return pug`
    View.body
      Text.greeting Hello World
  `
}
