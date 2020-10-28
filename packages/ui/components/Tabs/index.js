import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { observer, useBind } from 'startupjs'
import propTypes from 'prop-types'
import { FlatList } from 'react-native'
import Div from './../Div'
import { TabsProvider } from './tabsContext'
import Tab from './Tab'
import './index.styl'

function Tabs ({
  containerStyle,
  children,
  iconPosition,
  activeStyle,
  style,
  $value
}) {
  let value
  let onChange
  ;({ value, onChange } = useBind({ $value, value, onChange }))

  const valueToIndex = useMemo(() => {
    const _valueToIndex = {}

    React.Children.toArray(children).forEach((child, index) => {
      _valueToIndex[child.props.value || index] = index
    })

    return _valueToIndex
  }, [React.Children.count(children)])

  const [tabWidth, setTabWidth] = useState(0)
  const [tabIndex, setTabIndex] = useState(valueToIndex[value] || 0)

  const contentWrapper = useRef()
  const tabsWrapper = useRef()

  useEffect(() => {
    setTabIndex(valueToIndex[value])
  }, [value])

  useEffect(() => {
    if (children && tabIndex) {
      contentWrapper.current.scrollToIndex({ animated: true, index: tabIndex, viewPosition: 0.5 })
      tabsWrapper.current.scrollToIndex({ animated: true, index: tabIndex, viewPosition: 0.5 })
    }
  }, [tabIndex])

  const onTabPress = (index, value) => {
    contentWrapper.current.scrollToIndex({ animated: false, index, viewPosition: 0.5 })
    onChange ? onChange(value || index) : setTabIndex(index)
  }

  const tabs = React.Children.toArray(children).map((child, index) => {
    if (child.type === Tab) {
      return React.cloneElement(child, { active: tabIndex === index, activeStyle, style, iconPosition, onPress: () => onTabPress(index, child.props.value), index, key: index })
    } else {
      return pug`
        Tab=child
      `
    }
  })

  const content = React.Children.toArray(children).map(child => child.props.children)

  const renderContent = ({ item }) => {
    return pug`
      Div(style={ width: tabWidth })=item
    `
  }
  const renderTab = ({ item }) => {
    return pug`
      Div.tab=item
    `
  }

  const getItemLayout = useCallback((data, index) => (
    { length: tabWidth, offset: tabWidth * index, index }
  ), [tabWidth])

  const onViewableItemsChanged = useRef(item => {
    const _value = idx => Object.keys(valueToIndex).find(key => valueToIndex[key] === idx)
    // A check 'item.viewableItems[0] &&' is written in this place due to the fact that on the web, when you quickly scroll tabs from 'item.viewableItems', an empty array is returned
    if (item.viewableItems[0]) {
      const value = _value(item.viewableItems[0].index)
      onChange ? onChange(value) : setTabIndex(item.viewableItems[0].index)
    }
  })

  const cellRender = ({ children, ...props }) => {
    return pug`
      Div.tabWrap(...props)=children
    `
  }

  return pug`
    TabsProvider(value={iconPosition})
      Div(style=containerStyle)
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
          windowSize=tabs.length ? tabs.length : 1
          initialScrollIndex=tabIndex
        )
        FlatList.content(
          data=content
          renderItem=renderContent
          ref=contentWrapper
          horizontal
          showsHorizontalScrollIndicator=false
          windowSize=content.length ? content.length : 1
          removeClippedSubviews
          initialNumToRender=1
          maxToRenderPerBatch=0
          decelerationRate=0
          snapToInterval=tabWidth
          initialScrollIndex=tabIndex
          snapToAlignment='center'
          getItemLayout=getItemLayout
          onLayout=item => setTabWidth(item.nativeEvent.layout.width)
          onViewableItemsChanged=onViewableItemsChanged.current
          viewabilityConfig={ itemVisiblePercentThreshold: 50, minimumViewTime: 300 }
        )
  `
}

Tabs.defaultProps = {
  iconPosition: 'left'
}

Tabs.propTypes = {
  containerStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  activeStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  iconPosition: Tab.propTypes.iconPosition,
  $value: propTypes.any
}

const ObservedTabs = observer(Tabs)
ObservedTabs.Item = Tab
export default ObservedTabs
