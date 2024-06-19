import React, { useCallback, useMemo } from 'react'
// TODO: replace with FlashList. ATM there is a compilation error with it
// import { FlashList } from '@shopify/flash-list'
import { FlatList } from 'react-native'
import { pug, styl, observer, useQuery$, $, u, useValue$ } from 'startupjs'
import { Span, Div, guessInput, Button, Form, Modal, Br, useFormFields$ } from '@startupjs/ui'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { cell as Cell } from './inputs/default'
// TODO: get input overrides from ./inputs/*
// import * as DEFAULT from './inputs/default'
// const INPUTS = {}

export default observer(({ $schema, $collection }) => {
  const $items = useQuery$($collection.get(), {})

  const _inputsByName = getInputsByName($schema.get())
  const inputsByName = useMemo(() => _inputsByName, [JSON.stringify(_inputsByName)])

  const renderItem = useCallback(({ item: itemId } = {}) => {
    const $value = $items[itemId]
    return pug`
      Row($value=$value inputsByName=inputsByName)
    `
  }, [$items, inputsByName])

  const header = useMemo(() => pug`
    Div(row)
      each name in Object.keys(inputsByName)
        Div.th(key=name vAlign='center')
          Span(bold description numberOfLines=1)= name
  `, [inputsByName])

  // TODO: check if FlashList uses memo(), otherwise wrap it into one
  return pug`
    Toolbar($schema=$schema $collection=$collection)
    FlatList(
      ListHeaderComponent=header
      data=$items.getIds()
      renderItem=renderItem
      estimatedItemSize=u(4) + 1
    )
  `
  styl`
    .th
      padding 0 1u
      border-top 1px solid rgba(black, 0.1)
      border-right 1px solid rgba(black, 0.1)
      border-bottom 1px solid rgba(black, 0.1)
      width (15u + 1px)
      height (4u + 2px)
  `
})

const Toolbar = observer(({ $schema, $collection }) => {
  const $show = useValue$()
  const $new = useValue$()
  const $fields = useFormFields$($schema.get())

  function showNew () {
    $new.del()
    $show.setDiff(true)
  }

  async function create () {
    if (!$collection.get()) throw Error('Collection is not set')
    if ($schema.get('createdAt')) $new.set('createdAt', Date.now())
    await $[$collection.get()].add($new.getDeepCopy())
    $show.del()
  }

  return pug`
    Div.root(row)
      Button(icon=faPlus onPress=showNew color='text-subtle')
    Modal($visible=$show title='Add new item')
      Form($value=$new $fields=$fields)
      Br(lines=2)
      Button(onPress=create) Create
  `
  styl`
    .root
      padding 1u
  `
})

const Row = observer(({ $value, inputsByName }) => {
  return pug`
    Div(row)
      each name in Object.keys(inputsByName)
        - const input = inputsByName[name]
        Div.cell(key=name vAlign='center')
          Cell($value=$value[name])
  `
  styl`
    .cell
      padding 0 1u
      border-right 1px solid rgba(black, 0.1)
      border-bottom 1px solid rgba(black, 0.1)
      width (15u + 1px)
      height (4u + 1px)
  `
})

function getInputsByName (schema) {
  const inputByName = {}
  for (const name in schema) {
    inputByName[name] = guessInput(schema[name].input, schema[name].type, schema[name])
  }
  return inputByName
}
