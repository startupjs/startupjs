import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Dropdown, Br, Icon, Row } from 'ui'
import { faSort } from '@fortawesome/free-solid-svg-icons'

export const Example = () => {
  const [sort, setSort] = useState('')

  return pug`
    Br
    View(style={ width: 150 })
      Dropdown(
        titleDefault='Sort'
        activeValue=sort
        variant='buttons'
        onChange=value=> setSort(value)
      )
        Dropdown.Caption
          Row
            Text= 'Sort by: ' + sort
            Icon(icon=faSort)
        Dropdown.Item(value='popular' label='Popular')
        Dropdown.Item(value='brand' label='Brand')
        Dropdown.Item(value='name' label='Name')
  `
}

export const ExampleHeight = () => {
  const [sort, setSort] = useState('')

  return pug`
    Br
    View(style={ width: 150 })
      Dropdown(
        titleDefault='Sort'
        activeValue=sort
        variant='buttons'
        popoverHeight=140
        onChange=value=> setSort(value)
      )
        Dropdown.Caption
          Row
            Text= 'Sort by: ' + sort
            Icon(icon=faSort)
        Dropdown.Item(value='popular' label='Popular')
        Dropdown.Item(value='brand' label='Brand')
        Dropdown.Item(value='name' label='Name')
        Dropdown.Item(value='popular2' label='Popular2')
        Dropdown.Item(value='brand2' label='Brand2')
        Dropdown.Item(value='name2' label='Name2')
  `
}

export const ExampleWidth = () => {
  const [sort, setSort] = useState('')

  return pug`
    Br
    View(style={ alignSelf: 'start' })
      Dropdown(
        titleDefault='Sort'
        activeValue=sort
        variant='buttons'
        hasPopoverWidthCaption=true
        onChange=value=> setSort(value)
      )
        Dropdown.Caption
          Row
            Text= 'Sort by: ' + sort
            Icon(icon=faSort)
        Dropdown.Item(value='popular' label='Popular')
        Dropdown.Item(value='brand' label='Brand')
        Dropdown.Item(value='name' label='Name')
  `
}

export const ExampleMenu = () => {
  return pug`
    Br
    View(style={ width: 150 })
      Dropdown
        Dropdown.Caption
          Row
            Text= 'Show menu '
            Icon(icon=faSort)
        Dropdown.Item(label='Popular' onPress=()=> alert('Menu 1'))
        Dropdown.Item(label='Brand' onPress=()=> alert('Menu 2'))
        Dropdown.Item(label='Name' onPress=()=> alert('Menu '))
  `
}

export const ExampleVariant = () => {
  return pug`
    Br
    Row
      View(style={ width: 150 })
        Dropdown(
          titleDefault='Default style'
          variant='default'
        )
          Dropdown.Caption
            Row
              Text= 'default '
              Icon(icon=faSort)
          Dropdown.Item(label='Popular' onPress=()=> console.log('Menu 1'))
          Dropdown.Item(label='Brand' onPress=()=> console.log('Menu 2'))
          Dropdown.Item(label='Name' onPress=()=> console.log('Menu '))
      View(style={ width: 150 })
        Dropdown(variant='buttons')
          Dropdown.Caption
            Row
              Text= 'buttons '
              Icon(icon=faSort)
          Dropdown.Item(label='Popular' onPress=()=> console.log('Menu 1'))
          Dropdown.Item(label='Brand' onPress=()=> console.log('Menu 2'))
          Dropdown.Item(label='Name' onPress=()=> console.log('Menu '))
      
  `
}

export const ExampleCustom = () => {
  const [active, setActive] = useState()

  return pug`
    Br
    View(style={ width: 150 })
      Dropdown(
        variant='custom'
        activeValue=active
        customStylePopover={ backgroundColor: '#000' }
        onChange=value=> setActive(value)
      )
        Dropdown.Caption
          Row
            Text= 'Show menu '
            Icon(icon=faSort)
        Dropdown.Item(value=1)
          View(style=active === 1 ? { backgroundColor: '#eee', alignItems: 'center', padding: 8}
            : { backgroundColor: '#000', alignItems: 'center', padding: 8 })
            Text(style=active === 1 ? { color: '#6563d8' } : { color: '#fff' })
              | Menu 1
        Dropdown.Item(value=2)
          View(style=active === 2 ? { backgroundColor: '#eee', alignItems: 'center', padding: 8}
            : { backgroundColor: '#000', alignItems: 'center', padding: 8 })
            Text(style=active === 2 ? { color: '#6563d8' } : { color: '#fff' })
              | Menu 2
        Dropdown.Item(value=3)
          View(style=active === 3 ? { backgroundColor: '#eee', alignItems: 'center', padding: 8}
            : { backgroundColor: '#000', alignItems: 'center', padding: 8 })
            Text(style=active === 3 ? { color: '#6563d8' } : { color: '#fff' })
              | Menu 3
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
