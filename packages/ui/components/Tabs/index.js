import React, { useLayoutEffect } from 'react'
import { TabView } from 'react-native-tab-view'
import { observer, useValue } from 'startupjs'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import findIndex from 'lodash/findIndex'
import pick from 'lodash/pick'
import Span from './../typography/Span'
import Bar from './Bar'
import themed from '../../theming/themed'
import './index.styl'

function Tabs ({
  style,
  tabsStyle,
  routes,
  initialKey,
  $value,
  renderTabBar,
  renderLabel,
  onChange,
  onIndexChange, // skip property
  ...props
}) {
  const [localValue, $localValue] = useValue(initialKey || routes[0]?.key)
  const tabBarProps = pick(props, Object.keys(Bar.propTypes))
  const tabViewProps = pick(props, Object.keys(ObservedTabs.propTypes))

  useLayoutEffect(() => {
    if (!$value) return
    $localValue.ref($value)
    return () => $localValue.removeRef()
  }, [])

  const tabIndex = findIndex(routes, { key: localValue })

  function _renderTabBar (props) {
    if (renderTabBar) return renderTabBar(props)

    return pug`
      Bar.bar(
        indicatorStyleName='indicator'
        renderLabel=_renderLabel
        ...tabBarProps
        ...props
      )
    `
  }

  function _renderLabel (props) {
    if (renderLabel) return renderLabel(props)

    return pug`
      Span.label(styleName={ focused: props.focused })
        = props.route.title.toUpperCase()
    `
  }

  function _onIndexChange (index) {
    const key = routes[index].key
    onChange
      ? onChange(key)
      : $localValue.set(key)
  }

  return pug`
    //- remove Div when issue will be fixed https://github.com/satya164/react-native-tab-view/issues/1110
    //- remove Div when issue 2 will be fixed https://github.com/satya164/react-native-tab-view/pull/1252
    Div.root(style=style)
      TabView(
        style=tabsStyle
        navigationState={ index: tabIndex, routes }
        renderTabBar=_renderTabBar
        onIndexChange=_onIndexChange
        ...tabViewProps
      )
  `
}

Tabs.defaultProps = {}

Tabs.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    title: PropTypes.string
  })),
  initialKey: PropTypes.string,
  $value: PropTypes.any,
  onChange: PropTypes.func,
  onIndexChange: PropTypes.func,
  navigationState: PropTypes.object,
  renderScene: PropTypes.func,
  initialLayout: PropTypes.any,
  keyboardDismissMode: PropTypes.string,
  lazy: PropTypes.bool,
  lazyPreloadDistance: PropTypes.number,
  onSwipeStart: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  renderLazyPlaceholder: PropTypes.func,
  renderTabBar: PropTypes.func,
  sceneContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tabsStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  swipeEnabled: PropTypes.bool,
  tabBarPosition: PropTypes.string
}

const ObservedTabs = observer(themed('Tabs', Tabs))

ObservedTabs.Bar = Bar

export default ObservedTabs
