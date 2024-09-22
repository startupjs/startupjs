import React from 'react'
import { TabBar } from 'react-native-tab-view'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'

function Bar ({
  ...props
}) {
  return pug`
    TabBar(...props)
  `
}

// propTypes are listed here because we cannot pick them up from react-native-tab-view
Bar.propTypes = {
  getLabelText: PropTypes.func,
  getAccessible: PropTypes.func,
  getAccessibilityLabel: PropTypes.func,
  getTestID: PropTypes.func,
  renderIcon: PropTypes.func,
  renderLabel: PropTypes.func,
  renderTabBarItem: PropTypes.func,
  renderIndicator: PropTypes.func,
  renderBadge: PropTypes.func,
  onTabPress: PropTypes.func,
  onTabLongPress: PropTypes.func,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  pressColor: PropTypes.string,
  pressOpacity: PropTypes.number,
  scrollEnabled: PropTypes.bool,
  bounces: PropTypes.bool,
  tabStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  indicatorStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  indicatorContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

export default observer(Bar)
