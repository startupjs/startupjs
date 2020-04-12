import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Popover, Icon, Br, Row, Button } from 'ui'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'

export const Example = () => {
  const [visible, setVisible] = useState(false)

  return pug`
    Br
    Popover(
      width=300
      height=200
      visible=visible
      hasWidthCaption=false
      onDismiss=()=> setVisible(false)
    )
      Popover.Caption(style={ width: 32 })
        TouchableOpacity(onPress=()=> setVisible(true))
          Icon(icon=faUserCircle size='xl')
      View(style={ padding: 20, height: '100%' })
        Text Контент
  `
}

export const ExamplePosition = () => {
  const [visible, setVisible] = useState('')

  return pug`
    Br
    Row
      View
        Popover(
          width=300
          height=200
          visible=visible === 'bottom-right'
          hasWidthCaption=false
          onDismiss=()=> setVisible('')
        )
          Popover.Caption(style={ width: 150, marginRight: 16 })
            Button(onPress=()=> setVisible('bottom-right')) Bottom Right
          View(style={ padding: 20, height: '100%' })
            Text Контент
      View
        Popover(
          width=300
          height=200
          visible=visible === 'bottom-left'
          hasWidthCaption=false
          positionHorizontal="left"
          onDismiss=()=> setVisible(false)
        )
          Popover.Caption(style={ width: 150, marginRight: 16 })
            Button(onPress=()=> setVisible('bottom-left')) Bottom Left
          View(style={ padding: 20, height: '100%' })
            Text Контент
      View
        Popover(
          width=300
          height=200
          visible=visible === 'bottom-center'
          hasWidthCaption=false
          positionHorizontal="center"
          onDismiss=()=> setVisible(false)
        )
          Popover.Caption(style={ width: 150, marginRight: 16 })
            Button(onPress=()=> setVisible('bottom-center')) Bottom Center
          View(style={ padding: 20, height: '100%' })
            Text Контент
      View
        Popover(
          width=300
          height=200
          visible=visible === 'center-right'
          hasWidthCaption=false
          positionHorizontal="right"
          positionVertical="center"
          onDismiss=()=> setVisible(false)
        )
          Popover.Caption(style={ width: 150, marginRight: 16 })
            Button(onPress=()=> setVisible('center-right')) Center Right
          View(style={ padding: 20, height: '100%' })
            Text Контент
      View
        Popover(
          width=300
          height=200
          visible=visible === 'center-center'
          hasWidthCaption=false
          positionHorizontal="center"
          positionVertical="center"
          onDismiss=()=> setVisible(false)
        )
          Popover.Caption(style={ width: 150, marginRight: 16 })
            Button(onPress=()=> setVisible('center-center')) Center Center
          View(style={ padding: 20, height: '100%' })
            Text Контент
      View
        Popover(
          width=300
          height=200
          visible=visible === 'center-left'
          hasWidthCaption=false
          positionHorizontal="left"
          positionVertical="center"
          onDismiss=()=> setVisible(false)
        )
          Popover.Caption(style={ width: 150, marginRight: 16 })
            Button(onPress=()=> setVisible('center-left')) Center Left
          View(style={ padding: 20, height: '100%' })
            Text Контент
  `
}

export const ExampleAnimate = () => {
  const [visible, setVisible] = useState('')

  return pug`
    Br
    Row
      View
        Popover(
          width=300
          height=160
          visible=visible === 'default'
          onDismiss=()=> setVisible('')
        )
          Popover.Caption(style={ width: 150, marginRight: 16 })
            Button(onPress=()=> setVisible('default')) Default
          View(style={ padding: 20, height: '100%' })
            Text Контент
      View
        Popover(
          width=300
          height=160
          visible=visible === 'slide'
          animateType='slide'
          positionHorizontal='center'
          onDismiss=()=> setVisible('')
        )
          Popover.Caption(style={ width: 150, marginRight: 16 })
            Button(onPress=()=> setVisible('slide')) Slide
          View(style={ padding: 20, height: '100%' })
            Text Контент
      View
        Popover(
          width=300
          height=160
          visible=visible === 'scale'
          animateType='scale'
          hasWidthCaption=false
          onDismiss=()=> setVisible('')
        )
          Popover.Caption(style={ width: 150, marginRight: 16 })
            Button(onPress=()=> setVisible('scale')) Slide
          View(style={ padding: 20, height: '100%' })
            Text Контент
    Br
    Br
    Br
    Br
    Br
    Br
    Br
    Br
    Br
  `
}
