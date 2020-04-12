import React, { useState } from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import { Button, DrawerExtend, Br, Row } from 'ui'
import { useDrawerDismiss } from '../../../../hooks'
import { withRouter } from 'react-router-dom'

export const Example = () => {
  const [visible, setVisible] = useState(false)

  return pug`
    Br
    View
      DrawerExtend(
        visible=visible
        onDismiss=() => setVisible(false)
        styleContent={ width: 250 }
      )
        View
          Text Контент
      Button(
        onPress=() => setVisible(true)
        style={ width: 160 }
      ) Развернуть
  `
}

export const ExamplePosition = () => {
  const positions = ['left', 'right', 'top', 'bottom']
  const names = ['Слева', 'Справа', 'Сверху', 'Снизу']
  const [visible, setVisible] = useState('')

  return pug`
    Br
    Row
      each item, index in positions
        DrawerExtend(position=item visible=visible === item onDismiss=() => setVisible(''))
          View(style={ padding: 20 })
            Text= names[index]
        Button(onPress=() => setVisible(item) style={ width: 160, marginRight: 16 })
          = names[index]
  `
}

export const ExampleSwipe = () => {
  const [visible, setVisible] = useState('')

  return pug`
    Br
    Row
      DrawerExtend(
        visible=visible === 'zone'
        onDismiss=() => setVisible('')
        styleContent={ width: 250 }
        styleSwipe={ backgroundColor: '#eeeeee' }
      )
      Button(
        onPress=() => setVisible('zone')
        style={ width: 280, marginRight: 24 }
      ) Отображение зоны свайпа

      DrawerExtend(
        visible=visible === 'custom'
        onDismiss=() => setVisible('')
        styleContent={ width: 250 }
        styleSwipe={ backgroundColor: '#eeeeee', width: '30%',
          height: '100px', top: 30 }
      )
      Button(
        onPress=() => setVisible('custom')
        style={ width: 280 }
      ) Кастомная зона свайпа
  `
}

export const ExampleCustom = () => {
  const [visible, setVisible] = useState()

  return pug`
    Br
    Row
      DrawerExtend(
        visible=visible === 1
        position='bottom'
        onDismiss=() => setVisible()
        styleCase={ alignItems: 'center' }
        styleContent={ width: 500, borderTopLeftRadius: 40, 
          borderTopRightRadius: 40 }
      )
      Button(
        onPress=() => setVisible(1)
        style={ width: 280, marginRight: 24 }
      ) Пример 1

      DrawerExtend(
        visible=visible === 2
        position='top'
        onDismiss=() => setVisible()
        styleCase={ alignItems: 'center' }
        styleContent={ width: '60%', height: 60, paddingTop: 20 }
        styleSwipe={ height: '100%' }
        hasDefaultStyleContent=false
        isShowOverlay=false
      )
        View(style={ width: '100%', height: '100%',
          backgroundColor: '#6464f9', borderRadius: 20 })
      Button(
        onPress=() => setVisible(2)
        style={ width: 280, marginRight: 24 }
      ) Пример 2
  `
}

export const ExampleHook = withRouter(({ history }) => {
  const [leftDrawer, setLeftDrawer] = useState(false)
  const [rifgtDrawer, setRightDrawer] = useState(false)
  const [leftVisible, setLeftVisible] = useState(false)

  const [onDismiss, setOnDismiss] = useDrawerDismiss({
    rightDrawer: () => setRightDrawer(true),
    goToPage: path => history.push(path),
    default: () => setLeftDrawer(false)
  })

  return pug`
    Br
    Row
      DrawerExtend(
        visible=rifgtDrawer
        position='right'
        onDismiss=()=> setRightDrawer(false)
        styleContent={ width: 240 }
      )

      DrawerExtend(visible=leftDrawer onDismiss=onDismiss styleContent={ width: 240 })
        TouchableWithoutFeedback(onPress=()=> setOnDismiss('rightDrawer'))
          View
            Text Открыть правый Drawer
        TouchableWithoutFeedback(onPress=()=> setOnDismiss('goToPage', '/ru/docs/Button'))
          View
            Text Открыть другую страницу

      DrawerExtend(
        visible=leftVisible
        onDismiss=()=> setLeftVisible(false)
        styleContent={ width: 240 }
      )
        TouchableWithoutFeedback(onPress=()=> history.push('/ru/docs/Button'))
          View
            Text Открыть другую страницу

      Button(
        onPress=() => setLeftDrawer(true)
        style={ width: 280, marginRight: 24 }
      ) С хуком
      Button(
        onPress=() => setLeftVisible(true)
        style={ width: 280, marginRight: 24 }
      ) Без хука
  `
})
