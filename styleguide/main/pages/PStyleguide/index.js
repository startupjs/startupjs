import React, { useState } from 'react'
import { View, Text, Platform, Switch } from 'react-native'
import { observer, $root, useLocal } from 'startupjs'
import { Props } from 'components'
import './index.styl'
import TestComponent from './TestComponent'
import {
  Br,
  Button,
  Card,
  Div,
  H1, H2, H3, H4, H5, H6,
  Icon,
  Layout,
  Progress,
  Row,
  Sidebar,
  Span,
  StatusBar
} from '@startupjs/ui'

// Just add a new component here to display it in the styleguide:
const COMPONENTS = {
  TestComponent,
  Br,
  Button,
  Card,
  Div,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Icon,
  Layout,
  Progress,
  Row,
  Sidebar,
  Span,
  StatusBar
}

export default observer(function PStyleguide () {
  let [componentName, setComponentName] = useState(getComponentName)

  $root.setNull('_session.Props.showGrid', true)
  let [showGrid, $showGrid] = useLocal('_session.Props.showGrid')
  $root.setNull('_session.Props.validateWidth', false)
  let [validateWidth, $validateWidth] = useLocal('_session.Props.validateWidth')

  function goTo (aComponentName) {
    if (Platform.OS === 'web') {
      window.history.pushState(undefined, undefined, `?componentName=${aComponentName}`)
    }
    $root.set('_session.Props.activeComponent', aComponentName)
    setComponentName(aComponentName)
  }

  return pug`
    View.root
      View.left
        View.leftMain
          each aComponentName in Object.keys(COMPONENTS)
            Text.link(
              key=aComponentName
              styleName={ active: componentName === aComponentName }
              onPress=() => goTo(aComponentName)
            )= aComponentName
        View.leftFooter
          if showGrid
            View.line
              Span.lineLabel(description) VALIDATE WIDTH
              Switch(
                value=validateWidth
                onValueChange=value => $validateWidth.set(value)
              )
          View.line
            Span.lineLabel(description) SHOW GRID
            Switch(
              value=showGrid
              onValueChange=value => $showGrid.set(value)
            )
      Props.right(
        key=componentName
        Component=COMPONENTS[componentName]
        componentName=componentName
        showGrid=showGrid
        validateWidth=validateWidth
      )
  `
})

function getComponentName () {
  if (Platform.OS === 'web') {
    let componentName = window.location.href.replace(/.*[?&]componentName=/, '').replace(/&.+/, '')
    if (componentName && COMPONENTS[componentName]) return componentName
  }
  return $root.get('_session.Props.activeComponent') || Object.keys(COMPONENTS)[0]
}
