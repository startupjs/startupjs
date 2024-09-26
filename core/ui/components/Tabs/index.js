import React from 'react'
import { TabView } from 'react-native-tab-view'
import { pug, styl, observer, $ } from 'startupjs'
import PropTypes from 'prop-types'
import findIndex from 'lodash/findIndex'
import pick from 'lodash/pick'
import Span from './../typography/Span'
import Bar from './Bar'
import themed from '../../theming/themed'

function Tabs ({
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
  // TODO: DEPRECATED! Remove this prop in the next major version
  //       Use `style` instead. This was needed before to workaround underlying tabs lib issue
  if (tabsStyle) console.warn('[@startupjs/ui -> Tabs] `tabsStyle` prop is deprecated. Use `style` instead.')

  const $localValue = $value || $(initialKey || routes[0]?.key)
  const tabBarProps = pick(props, Object.keys(Bar.propTypes))
  const tabViewProps = pick(props, Object.keys(ObservedTabs.propTypes))

  const tabIndex = findIndex(routes, { key: $localValue.get() })

  function _renderTabBar (props) {
    if (renderTabBar) return renderTabBar(props)

    return pug`
      Bar.bar(
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
    TabView(
      part='root'
      style=tabsStyle
      navigationState={ index: tabIndex, routes }
      renderTabBar=_renderTabBar
      onIndexChange=_onIndexChange
      ...tabViewProps
    )
  `
  styl`
    .bar
      background-color transparent
      &:part(indicator)
        background-color var(--color-bg-primary)

    .label
      &.focused
        color var(--color-text-primary)
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
