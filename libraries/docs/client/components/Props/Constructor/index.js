import React from 'react'
import { Platform } from 'react-native'
import { pug, observer, $ } from 'startupjs'
import { Span, Tag, themed, Div } from '@startupjs/ui'
import Table from './Table'
import Tbody from './Tbody'
import Thead from './Thead'
import Tr from './Tr'
import Td from './Td'
import TypeCell from './TypeCell'
import ValueCell from './ValueCell'
import './index.styl'

export default observer(themed(function Constructor ({
  Component,
  extendedFrom,
  entries,
  $props,
  style
}) {
  const $showExtends = $()
  function renderEntry (entry) {
    const { name, type, defaultValue, possibleValues, isRequired } = entry
    return pug`
      Tr(key=name)
        Td
          Span.name(
            style={
              fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
            }
          )= name
          if isRequired
            Tag.required(
              variant='outlined'
              size='s'
              color='error'
              shape='rounded'
            ) Required
          if defaultValue != null
            Span.valueDefault
              Span(description) =#{' '}
              Span.value= JSON.stringify(defaultValue)
        Td: Span(description italic)= entry.description || '-'
        Td: TypeCell(possibleValues=possibleValues type=type)
        Td.vCenter: ValueCell(entry=entry $props=$props)
    `
  }
  return pug`
    Table.table(style=style)
      Thead.thead
        Tr
          Td: Span.header PROP
          Td: Span.header DESCRIPTION
          Td: Span.header TYPE
          Td: Span.header.right VALUE
      Tbody
        if extendedFrom
          Div.extends
            Div.collapsibleHeader(onPress=() => $showExtends.set(!$showExtends.get()))
              Span(italic style={
                fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
              })
                if $showExtends.get()
                  | -#{' '}
                else
                  | +#{' '}
                | Extends component props from#{' '}
                Span(bold)= extendedFrom + ' '
                if $showExtends.get()
                  | (tap to collapse)
                else
                  | (tap to expand)
            if $showExtends.get()
              each entry, index in entries
                if entry.extendedFrom === extendedFrom
                  = renderEntry(entry)
        each entry, index in entries
          if !entry.extendedFrom
            = renderEntry(entry)
  `
}))
