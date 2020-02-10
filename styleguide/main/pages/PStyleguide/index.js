import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Props } from 'components'
import { TextInput } from 'react-native'
import * as COMPONENTS from 'ui'
import {
  useComponentName,
  useShowGrid,
  useShowSizes,
  useValidateWidth,
  useDarkTheme
} from 'clientHelpers'
import './index.styl'

export default observer(function PStyleguide () {
  const [componentName] = useComponentName()
  const [showGrid] = useShowGrid()
  const [showSizes] = useShowSizes()
  const [validateWidth] = useValidateWidth()
  const [darkTheme] = useDarkTheme()
  const COMPONENT = COMPONENTS[componentName]
  const [value, setValue] = useState()

  if (!COMPONENT) {
    return pug`
      COMPONENTS.H1 Component not found
    `
  }
  const Input = COMPONENTS.TextInput

  return pug`
    COMPONENTS.Row
      TextInput(value='hello')
      Input(
        value=value
        placeholder='write here'
        onChangeText=(value) => {
          console.log(value, 'myyyvalue')
          setValue(value)
        }
      )
      //- style={marginLeft: -150, zIndex: 100, background: 'transparent'}
      Input(
        value=value
        placeholder='write here'
        numberOfLines=4
        onChangeText=(value) => {
          console.log(value, 'value')
          setValue(value)
        }
      )
      //- Input(
      //-   value=value
      //-   placeholder='write here'
      //-   resize=true
      //-   onChangeText=(value) => {
      //-     console.log(value, 'value')
      //-     setValue(value)
      //-   }
      //- )
    Props.root(
      theme=darkTheme ? 'dark' : undefined
      key=componentName
      Component=COMPONENT
      componentName=componentName
      showSizes=showSizes
      showGrid=showGrid
      validateWidth=validateWidth
    )
  `
})
