import React, { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { observer, $root, useComponentId } from 'startupjs'
import { themed, Button, Row, Div } from '@startupjs/ui'
import parsePropTypes from 'parse-prop-types'
import Constructor from './Constructor'
import Renderer from './Renderer'
import './index.styl'

function parseEntries (entries) {
  return entries.map(entry => {
    let meta = entry[1]
    return {
      name: entry[0],
      type: meta.type.name,
      defaultValue: meta.defaultValue && meta.defaultValue.value,
      possibleValues: meta.type.value,
      isRequired: meta.required
    }
  })
}

function useEntries ({ Component, props = {}, extraParams }) {
  return useMemo(() => {
    const entries = parseEntries(Object.entries(parsePropTypes(Component)))
      .filter(entry => entry.name[0] !== '_') // skip private properties
      .map(item => {
        if (props[item.name] !== undefined) {
          item.value = props[item.name] // add property value to Renderer
        }
        if (extraParams?.[item.name]) {
          item.extraParams = extraParams?.[item.name]
        }
        return item
      })
    return entries
  }, [])
}

async function useInitDefaultProps ({ entries, $theProps }) {
  if ($theProps.get()) return
  $theProps.set('', {})

  const promises = []

  for (const prop of entries) {
    if (prop.defaultValue !== undefined || prop.value !== undefined) {
      // NOTE: Due to a racer patch, last argument cannot be a function
      // because it will be used as a callback of `$props.set`,
      // so we use null to avoid this behavior when defaultValue is function
      promises.push($theProps.set(prop.name, prop.value || prop.defaultValue, null))
    }
  }

  await Promise.all(promises)
}

export default observer(themed(function PComponent ({
  Component,
  $props,
  props,
  extraParams,
  componentName,
  showGrid,
  style,
  validateWidth,
  showSizes,
  theme,
  block: defaultBlock
}) {
  const [block, setBlock] = useState(!!defaultBlock)
  const componentId = useComponentId()

  const $theProps = useMemo(() => {
    if (!$props) {
      return $root.scope(`_session.Props.${componentId}`)
    } else {
      return $props
    }
  }, [$props])

  const entries = useEntries({ Component, props, extraParams })
  useInitDefaultProps({ entries, $theProps })

  return pug`
    Div.root(style=style)
      Div.top(styleName=[theme])
        Constructor(
          Component=Component
          $props=$theProps
          entries=entries
          props=props
        )

      Div.bottom(styleName=[theme])
        ScrollView.scroll(
          contentContainerStyleName='scrollContent'
          horizontal
        )
          Renderer(
            Component=Component
            props=$theProps.get()
            showGrid=showGrid
            validateWidth=validateWidth
            showSizes=showSizes
            block=block
          )
        Row.display(align='right')
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
