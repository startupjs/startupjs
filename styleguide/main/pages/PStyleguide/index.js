import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import { Props } from 'components'
import * as COMPONENTS from 'ui'
import { useComponentName } from 'clientHelpers'
import './index.styl'

export default observer(function PStyleguide () {
  const [componentName] = useComponentName()

  return pug`
    View.root
      Props(
        key=componentName
        Component=COMPONENTS[componentName]
        componentName=componentName
      )
  `
})
