import React, { useRef, useState, useEffect } from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { FlatList } from 'react-native'
import Div from './../Div'
import { TabsProvider } from './tabsContext'
import Tab from './Tab'
import './index.styl'

function Tabs ({
  style,
  children,
  activeBorder,
  iconPosition,
  activeColor
}) {
  const [tabWidth, setTabWidth] = useState()
  const [actualTab, setActualTab] = useState(0)

  const contentWrapper = useRef()
  const tabsWrapper = useRef()

  useEffect(() => {
    if (children) {
      contentWrapper.current.scrollToIndex({ animated: true, index: actualTab, viewPosition: 0.5 })
      tabsWrapper.current.scrollToIndex({ animated: true, index: actualTab, viewPosition: 0.5 })
    }
  }, [actualTab])

  const onTabPress = index => {
    setActualTab(index)
  }

  const tabs = children && React.Children.toArray(children).map((child, index) => {
    if (child.type === Tab) {
      return React.cloneElement(child, { activeBorder, iconPosition, activeColor, onPress: () => onTabPress(index), index, key: index })
    }
  })

  const content = children && React.Children.toArray(children).map((child, index) => {
    if (child?.props?.children?.length === 1) {
      return React.cloneElement(child.props.children, { key: index })
    } else {
      return child.props.children
    }
  })

  const renderContent = item => {
    return pug`
      Div(style={ width: tabWidth })=item.item
    `
  }
  const renderTab = item => {
    return pug`
      Div.tab=item.item
    `
  }

  const getItemLayout = (data, index) => (
    { length: tabWidth, offset: tabWidth * index, index }
  )

  const onChange = useRef(item => {
    item.viewableItems[0] && setActualTab(item.viewableItems[0].index)
  })

  const cellRender = ({ children, ...props }) => {
    return pug`
      Div.tabWrap(...props)=children
    `
  }

  return pug`
    TabsProvider(value={iconPosition, active: actualTab})
      Div(style=style)
        FlatList.menu(
          data=tabs
          renderItem=renderTab
          ref=tabsWrapper
          horizontal
          showsHorizontalScrollIndicator=false
          contentContainerStyle={ flexGrow: 1 }
          CellRendererComponent=cellRender
          onScrollToIndexFailed=() => null
          removeClippedSubviews
          windowSize=tabs ? tabs.length : 1
        )
        FlatList.content(
          data=content
          renderItem=renderContent
          ref=contentWrapper
          horizontal
          showsHorizontalScrollIndicator=false
          windowSize=content ? content.length : 1
          removeClippedSubviews
          initialNumToRender=1
          maxToRenderPerBatch=1
          decelerationRate=0
          snapToInterval=tabWidth
          snapToAlignment='center'
          getItemLayout=getItemLayout
          onLayout=item => setTabWidth(item.nativeEvent.layout.width)
          onViewableItemsChanged=onChange.current
          viewabilityConfig={ itemVisiblePercentThreshold: 50, minimumViewTime: 300 }
        )
  `
}

Tabs.defaultProps = {
  activeBorder: 'bottom',
  iconPosition: 'left'
}

Tabs.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  activeBorder: propTypes.oneOf(['top', 'bottom', 'left', 'right', 'none']),
  iconPosition: Tab.propTypes.iconPosition,
  activeColor: propTypes.string
}

const ObservedTabs = observer(Tabs)
ObservedTabs.Item = Tab
export default ObservedTabs
