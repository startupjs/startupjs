import React from 'react'
import RouterComponent from './RouterComponent'
import { withRouter } from 'react-router-native'
import { $root, emit } from 'startupjs'
import { Linking, Platform } from 'react-native'
import { matchPath } from 'react-router'
import Routes from './Routes'
import Error from './Error'
const isWeb = Platform.OS === 'web'

const getApp = (url, routes) => {
  const route = routes.find(route => matchPath(url, route))
  return route ? route.app : ''
}

@withRouter
class AppsFactory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      routes: props.routes,
      app: '',
      err: null
    }
  }

  componentDidMount () {
    $root.on('url', this.goTo)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!nextProps.location) return null
    const app = getApp(nextProps.location.pathname, prevState.routes)
    if (prevState.app !== app) {
      return { app }
    }
    return null
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      if (this.state.err) this.setState({ err: null })
      emit('updateRoutes')
    }
    const { nextApp, nextErr } = nextState
    const { app, err } = this.state
    return nextApp !== app || nextErr !== err
  }

  goTo = url => {
    const { routes } = this.props
    const app = getApp(url.replace(/\?.*$/, ''), routes)

    if (app) {
      this.props.history.push(url)
    } else {
      isWeb
        ? window.open(url, '_blank')
        : Linking.openURL(url)
    }
  }

  componentWillUnmount () {
    $root.removeListener('url', this.goTo)
  }

  render () {
    const { apps, routes, errorPages, history } = this.props
    const { err } = this.state
    const app = this.state.app
    const Layout = app ? apps[app] : null

    if (!Layout) {
      console.error('App not found')
      return null
    }

    return pug`
      if err
        Error(value=err pages=errorPages history=history)
      else
        Layout
          Routes(
            routes=routes
            onRouteError=(err) => this.setState({ err })
          )
    `
  }
}

export default function Router (props) {
  return pug`
    RouterComponent
      AppsFactory(...props)
  `
}
