import React, { useState, useEffect } from 'react'
import { $root, emit, initLocalCollection } from 'startupjs'
import { Route } from 'react-router'
import { Dimensions, Platform, View } from 'react-native'
import omit from 'lodash/omit'
import Stack from 'react-router-native-stack'
const isWeb = Platform.OS === 'web'
const DEFAULT_ANIMATE = false // !isWeb ?

function getOrientation () {
  const dim = Dimensions.get('screen')
  return dim.width >= dim.height ? 'landscape' : 'portrait'
}

export default class Routes extends React.Component {
  componentDidMount () {
    $root.on('updateRoutes', this.update)
  }

  componentWillUnmount () {
    $root.removeListener('updateRoutes', this.update)
  }

  update = () => {
    this.forceUpdate()
  }

  render () {
    const { routes, animate = DEFAULT_ANIMATE, onRouteError } = this.props
    const routeComponents = routes.map(route => {
      return (
        <Route
          key={route.path}
          {...omit(route, ['component', 'routes'])}
          {...this.props}
          render={(props) => {
            initRoute(props)
            return pug`
              RouteComponent(...props route=route onError=onRouteError)
            `
          }}
        />
      )
    })

    if (animate) {
      return (
        <Stack gestureEnabled={false} animationType='slide-horizontal'>
          {routeComponents}
        </Stack>
      )
    } else {
      return routeComponents
    }
  }
}

function initRoute ({ location, match }) {
  // Check if url or search changed between page rerenderings
  const prevUrl = $root.get('$render.prevUrl')
  const prevQuery = $root.get('$render.prevQuery')
  const url = location.pathname
  const query = location.search

  if (url === prevUrl && query === prevQuery) return
  $root.batch(() => {
    if (!$root.get('$render')) initLocalCollection('$render')
    $root.setDiffDeep('$render.location', location)
    $root.setDiffDeep('$render.match', match)
    $root.setDiff('$render.prevUrl', url)
    $root.setDiff('$render.prevQuery', query)
    if (url !== prevUrl) {
      $root.setDiff('_session.url', location.pathname)
      $root.silent().destroy('_page')
      initLocalCollection('_page')
    }
  })
}

function RouteComponent ({ route, onError, ...props }) {
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
    const { orientation } = this.state
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

  if (render) {
    const RC = route.component
    return pug`
      View(key=orientation style={flex: 1})
        RC(
          ...props
          key=props.match.url
        )
    `
  } else {
    runFilters(route.filters)
    return null
  }
}
