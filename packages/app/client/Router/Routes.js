import React, { useMemo, useState, useEffect } from 'react'
import {
  $root,
  observer,
  emit,
  initLocalCollection
} from 'startupjs'
import { Route } from 'react-router'
import { Dimensions, Platform, View } from 'react-native'
import RoutesWrapper from './RoutesWrapper'
import omit from 'lodash/omit'

const isWeb = Platform.OS === 'web'

export default observer(function Routes ({
  routes,
  onRouteError,
  ...props
}) {
  function render (route, props) {
    setRenderParams(props)
    return pug`
      //- TODO: We can remove passing props because
      //- in pages we can use react-router hooks for this
      RouteComponent(...props route=route onError=onRouteError)
    `
  }

  const routeComponents = routes.map(route => {
    const props = omit(route, ['component'])
    return pug`
      Route(
        key=route.path
        render=render.bind(null, route)
        ...props
      )
    `
  })

  return pug`
    RoutesWrapper(...props)= routeComponents
  `
})

const RouteComponent = observer(function RCComponent ({
  route,
  onError,
  ...props
}) {
  const [render, setRender] = useState()
  const [orientation, setOrientation] = useState(getOrientation())
  useEffect(() => {
    // For android/iOS do force rerender when the screen orientation change
    if (isWeb) return
    Dimensions.addEventListener('change', orientationChangeHandler)
    return () => {
      Dimensions.removeEventListener('change', orientationChangeHandler)
    }
  }, [])

  function orientationChangeHandler () {
    const newOrientation = getOrientation()
    if (orientation !== newOrientation) setOrientation(newOrientation)
  }

  function runFilters (filters) {
    if (!filters) return setRender(true)
    filters = filters.slice()
    function runFilter (err) {
      if (err) return onError(err)
      const filter = filters.shift()
      if (typeof filter === 'function') {
        return filter($root, runFilter, (url) => {
          emit('url', url)
        })
      }
      setRender(true)
    }
    runFilter()
  }

  useMemo(() => {
    runFilters(route.filters)
  }, [])

  if (!render) return null

  const RC = route.component

  return pug`
    View(key=orientation style={flex: 1})
      RC(
        key=props.match.url
        params=route.params
        ...props
      )
  `
})

function getOrientation () {
  const dim = Dimensions.get('screen')
  return dim.width >= dim.height ? 'landscape' : 'portrait'
}

function setRenderParams ({ location, match }) {
  if (!$root.get('$render')) initLocalCollection('$render')
  $root.setDiffDeep('$render.params', match.params)
}
