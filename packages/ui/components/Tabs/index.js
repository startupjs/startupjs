import React, { useLayoutEffect } from 'react'
import { TabView, TabBar } from 'react-native-tab-view'
import { observer, useValue } from 'startupjs'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import findIndex from 'lodash/findIndex'
import Span from './../typography/Span'
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

  useLayoutEffect(() => {
    if (!$value) return
    $localValue.ref($value)
    return () => $localValue.removeRef()
  }, [])

  const tabIndex = findIndex(routes, { key: localValue })

  function _renderTabBar (props) {
    if (renderTabBar) return renderTabBar(props)

    return pug`
      TabBar.bar(
        indicatorStyleName='indicator'
        renderLabel=_renderLabel
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
    Div.root(style=style)
      TabView(
        style=tabsStyle
        navigationState={ index: tabIndex, routes }
        renderTabBar=_renderTabBar
        onIndexChange=_onIndexChange
        ...props
      )
  `
}

const ObservedTabs = observer(Tabs)

ObservedTabs.defaultProps = {}

ObservedTabs.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    title: PropTypes.string
  })),
  initialKey: PropTypes.string,
  $value: PropTypes.any,
  onChange: PropTypes.func
}

export default ObservedTabs
