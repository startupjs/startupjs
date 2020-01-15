import React from 'react'
import { observer, useValue } from 'startupjs'
import { View, ScrollView } from 'react-native'
import './index.styl'
import Constructor from './Constructor'
import Renderer from './Renderer'

export default observer(function PComponent ({ Component }) {
  let [props, $props] = useValue({})
  return pug`
    View.root
      ScrollView.top
        Constructor(Component=Component $props=$props)
      ScrollView.bottom
        Renderer(Component=Component props=props)
  `
})
