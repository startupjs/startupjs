import React, { useMemo, useState } from 'react'
import { pug, observer, $, useId } from 'startupjs'
import { themed, Button, Div, ScrollView } from '@startupjs/ui'
import Constructor from './Constructor'
import Renderer from './Renderer'
import './index.styl'

function useEntries ({ Component, props, extraParams, propsJsonSchema }) {
  return useMemo(() => {
    if (!propsJsonSchema?.properties) return []
    const entries = Object.entries(propsJsonSchema.properties)

    const res = parseEntries(entries)
      .filter(entry => entry.name[0] !== '_') // skip private properties

    for (const key in props) {
      const item = res.find(item => item.name === key)
      if (item) {
        item.value = props[key]
      } else {
        res.push({
          name: key,
          type: typeof props[key],
          value: props[key]
        })
      }
    }

    for (const key in extraParams) {
      const item = res.find(item => item.name === key)
      if (item) item.extraParams = extraParams[key]
    }

    return res
  }, [extraParams, props, propsJsonSchema])
}

function parseEntries (entries) {
  return entries.map(entry => {
    const name = entry[0]
    const meta = entry[1]
    let type = meta.type
    if (meta.enum) type = 'oneOf'
    if (meta.$comment && meta.$comment.startsWith('(')) type = 'function'
    if (!type) type = 'any'
    let extendedFrom = meta.extendedFrom
    // children prop is special, it should not be marked as extendedFrom
    if (name === 'children') extendedFrom = undefined
    return {
      name,
      type,
      defaultValue: meta.default,
      possibleValues: meta.enum,
      isRequired: meta.required,
      description: meta.description,
      extendedFrom
    }
  })
}

async function useInitDefaultProps ({ entries, $theProps }) {
  if ($theProps.get()) return
  $theProps.set({})

  const promises = []

  for (const { name, value, defaultValue } of entries) {
    if (value !== undefined) {
      promises.push($theProps[name].set(value))
    } else if (defaultValue !== undefined) {
      promises.push($theProps[name].set(defaultValue))
    }
  }
  if (promises.length) throw await Promise.all(promises)
}

export default observer(themed(function PComponent ({
  style,
  rendererStyle,
  Component,
  $props,
  props,
  propsJsonSchema,
  extraParams,
  componentName,
  showGrid,
  validateWidth,
  showSizes,
  noScroll,
  block: defaultBlock
}) {
  const [block, setBlock] = useState(!!defaultBlock)
  const componentId = useId()

  const $theProps = useMemo(() => {
    if (!$props) {
      return $.session.Props[componentId]
    } else {
      return $props
    }
  }, [$props, componentId])

  const entries = useEntries({ Component, props, extraParams, propsJsonSchema })
  useInitDefaultProps({ entries, $theProps })

  function Wrapper ({ children }) {
    if (noScroll) {
      return pug`
        Div.scroll.scrollContent
          = children
      `
    }

    return pug`
      ScrollView.scroll(
        contentContainerStyleName='scrollContent'
        horizontal
      )= children
    `
  }

  return pug`
    Div.root(style=style)
      Div.top
        Constructor(
          Component=Component
          extendedFrom=propsJsonSchema?.extendedFrom
          $props=$theProps
          entries=entries
        )

      Div.bottom
        Wrapper
          Renderer(
            style=rendererStyle
            Component=Component
            props=$theProps.get()
            showGrid=showGrid
            validateWidth=validateWidth
            showSizes=showSizes
            block=block
          )
        Div.display(align='right' row)
          Button(
            size='s'
            variant='text'
            color=block ? undefined : 'primary'
            onPress=() => setBlock(false)
          ) inline
          Button(
            size='s'
            variant='text'
            color=block ? 'primary' : undefined
            onPress=() => setBlock(true)
          ) block
  `
}))
