import React, {
  useImperativeHandle,
  useEffect,
  useState,
  useMemo,
  useRef
} from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'
import { pug, observer } from 'startupjs'
import { Div, Icon } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import themed from '../../theming/themed'
import './index.styl'

function Carousel ({
  style,
  arrowBackStyle,
  arrowNextStyle,
  startIndex,
  variant,
  isSwipe,
  isLoop,
  isEndless,
  isResponsive,
  hasArrows,
  hasDots,
  duration,
  children,
  onChange
}, ref) {
  arrowBackStyle = StyleSheet.flatten(arrowBackStyle)
  arrowNextStyle = StyleSheet.flatten(arrowNextStyle)

  const refRoot = useRef()
  const refCase = useRef()
  const refTimeout = useRef()
  const childrenInfo = useRef([])
  const coardName = variant === 'horizontal' ? 'x' : 'y'
  const sideName = variant === 'horizontal' ? 'width' : 'height'

  const childrenRefs = useMemo(() => {
    const _refs = {}
    children.forEach((c, i) => {
      _refs[i] = React.createRef()
    })
    return _refs
  }, [children.length])

  const validChildren = useMemo(() => {
    return getValidChildren({ children, isEndless, isResponsive, childrenRefs })
  }, [children])

  const [activeIndex, setActiveIndex] = useState(startIndex)
  const [rootInfo, setRootInfo] = useState({})
  const [caseInfo, setCaseInfo] = useState({})
  const [animateTranslate, setAnimateTranslate] = useState(new Animated.Value(0))
  const [caseStyle, setCaseStyle] = useState({})

  const [startDrag, setStartDrag] = useState(null)
  const [endDrag, setEndDrag] = useState(null)
  const [isRender, setIsRender] = useState(false)
  const [isAnimate, setIsAnimate] = useState(false)

  useImperativeHandle(ref, () => {
    return new Proxy(refRoot.current, {
      get (target, prop) {
        const actualChildIndex = activeIndex % children.length
        const activeRef = childrenRefs[actualChildIndex].current
        if (prop === 'getChildByIndex') return getChildByIndex
        if (prop === 'activeChild') return activeRef
        if (prop === 'element') return refRoot.current
        if (prop === 'toBack') return onBack
        if (prop === 'toNext') return onNext
        if (prop === 'toIndex') return toIndex
        if (target[prop]) return target.prop
        return activeRef[prop]
      }
    })
  }, [
    activeIndex,
    rootInfo,
    caseInfo,
    isAnimate,
    isRender
  ])

  // loop
  useEffect(() => {
    if (isRender && isLoop && !isAnimate) {
      refTimeout.current = setTimeout(onNext, 3000)
    } else {
      clearTimeout(refTimeout.current)
    }
  }, [isRender, isLoop, isAnimate, activeIndex])

  function getChildByIndex (index) {
    return childrenRefs[index].current
  }

  function onLayoutChild ({ nativeEvent }, index) {
    childrenInfo.current[index] = {
      width: Math.round(nativeEvent.layout.width),
      height: Math.round(nativeEvent.layout.height),
      x: Math.round(nativeEvent.layout.x),
      y: Math.round(nativeEvent.layout.y)
    }

    if (childrenInfo.current.length === validChildren.length && !isRender) {
      const isChildNotExists = childrenInfo.current.includes(undefined)
      if (isChildNotExists) return

      if (isEndless && isResponsive) {
        setActiveIndex(children.length + startIndex)

        const coard = childrenInfo.current[children.length + startIndex] &&
          -childrenInfo.current[children.length + startIndex][coardName]
        animateTranslate.setValue(coard || 0)
      } else {
        setActiveIndex(startIndex)

        const coard = childrenInfo.current[startIndex] &&
          -childrenInfo.current[startIndex][coardName]
        animateTranslate.setValue(coard || 0)
      }

      setIsRender(true)
    }
  }

  function toIndex (index) {
    setIsAnimate(true)

    if (isEndless && isResponsive) {
      index = index + children.length
    }

    let activeElement = childrenInfo.current[index]
    activeElement.index = index

    let toValue = -activeElement[coardName]
    if (caseInfo[sideName] - activeElement[coardName] < rootInfo[sideName]) {
      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        newPosition: caseInfo[sideName] - rootInfo[sideName],
        coardName,
        sideName
      })
      toValue = rootInfo[sideName] - caseInfo[sideName]
    }

    setActiveIndex(activeElement.index)
    onChange && onChange(activeElement.index % children.length)
    Animated.timing(animateTranslate, { toValue, duration }).start(() => {
      setIsAnimate(false)
    })
  }

  function onBack () {
    if ((activeIndex === 0 &&
        animateTranslate._value === 0 &&
        !isEndless) || isAnimate) return

    setIsAnimate(true)

    let activeElement = childrenInfo.current[activeIndex - 1]
    if (isResponsive) {
      activeElement.index = activeIndex - 1
    } else {
      const newPosition = childrenInfo.current[activeIndex][coardName] +
        childrenInfo.current[activeIndex][sideName] - rootInfo[sideName]

      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        coardName,
        sideName,
        newPosition
      })
    }

    let toValue = -activeElement[coardName]

    // reverse
    if (isEndless && !isResponsive && (activeIndex === 0)) {
      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        newPosition: caseInfo[sideName] - rootInfo[sideName],
        coardName,
        sideName
      })
      toValue = rootInfo[sideName] - caseInfo[sideName]
    }

    // swap
    if (isEndless && isResponsive && (activeIndex - 1 < children.length)) {
      const index = activeElement.index * 2 + 1
      setActiveIndex(index)
      onChange && onChange(index % children.length)
    } else {
      setActiveIndex(activeElement.index)
      onChange && onChange(activeElement.index % children.length)
    }

    Animated.timing(animateTranslate, { toValue, duration }).start(() => {
      if (isEndless && isResponsive && activeIndex - 1 < children.length) {
        animateTranslate.setValue(-childrenInfo.current[activeElement.index * 2 + 1][coardName])
      }

      setIsAnimate(false)
    })
  }

  function onNext () {
    if (isAnimate) return
    if (!childrenInfo.current[activeIndex + 1] && !isEndless) return
    if ((caseInfo[sideName] - childrenInfo.current[activeIndex][coardName] <= rootInfo[sideName]) && !isEndless) {
      return
    }

    setIsAnimate(true)

    let activeElement = childrenInfo.current[activeIndex + 1]
    if (isResponsive) {
      activeElement.index = activeIndex + 1
    } else {
      if (childrenInfo.current[activeIndex][coardName] + childrenInfo.current[activeIndex][sideName] > rootInfo[sideName]) {
        activeElement.index = activeIndex + 1
      } else {
        activeElement = getClosest({
          childrenInfo: childrenInfo.current,
          newPosition: childrenInfo.current[activeIndex][coardName] + rootInfo[sideName],
          coardName,
          sideName
        })
      }
    }

    let toValue = -activeElement[coardName]
    if (caseInfo[sideName] - activeElement[coardName] < rootInfo[sideName]) {
      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        newPosition: caseInfo[sideName] - rootInfo[sideName],
        coardName,
        sideName
      })
      toValue = -(caseInfo[sideName] - rootInfo[sideName])
    }

    // reverse
    if (isEndless && !isResponsive && (animateTranslate._value === -(caseInfo[sideName] - rootInfo[sideName]))) {
      activeElement = childrenInfo.current[0]
      activeElement.index = 0
      toValue = activeElement[coardName]
    }

    // swap
    if (isEndless && isResponsive && activeIndex + 1 >= (children.length * 2)) {
      setActiveIndex(children.length)
      onChange && onChange(0)
    } else {
      setActiveIndex(activeElement.index)
      onChange && onChange(activeElement.index % children.length)
    }

    Animated.timing(animateTranslate, { toValue, duration }).start(() => {
      if (isEndless && isResponsive && activeIndex + 1 >= (children.length * 2)) {
        animateTranslate.setValue(-childrenInfo.current[children.length][coardName])
      }

      setIsAnimate(false)
    })
  }

  useEffect(() => {
    if (!endDrag) return
    if (startDrag === endDrag) return
    setIsAnimate(true)

    let _endDrag = endDrag
    if (-endDrag > caseInfo[sideName]) {
      _endDrag = -caseInfo[sideName]
    }

    let activeElement = getClosest({
      childrenInfo: childrenInfo.current,
      newPosition: -_endDrag,
      coardName,
      sideName
    })
    const side = (startDrag > _endDrag) ? 'next' : 'back'

    if (activeElement.index === activeIndex) {
      if (side === 'next') {
        if (!childrenInfo.current[activeIndex + 1]) {
          activeElement = childrenInfo.current[activeIndex]
        } else {
          activeElement = childrenInfo.current[activeIndex + 1]
          activeElement.index = activeIndex + 1
        }
      } else if (activeIndex - 1 >= 0) {
        activeElement = childrenInfo.current[activeIndex - 1]
        activeElement.index = activeIndex - 1
      }
    }

    let toValue = -activeElement[coardName]
    if (caseInfo[sideName] - activeElement[coardName] < rootInfo[sideName]) {
      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        newPosition: caseInfo[sideName] - rootInfo[sideName],
        coardName,
        sideName
      })
      toValue = -(caseInfo[sideName] - rootInfo[sideName])
    }

    // swap
    if (side === 'back' && isEndless && isResponsive && (activeIndex - 1 < children.length)) {
      const index = activeElement.index * 2 + 1
      setActiveIndex(index)
      onChange && onChange(index % children.length)
    } else if (side === 'next' && isEndless && isResponsive && (activeIndex + 1 >= (children.length * 2))) {
      setActiveIndex(children.length)
      onChange && onChange(0)
    } else {
      setActiveIndex(activeElement.index)
      onChange && onChange(activeElement.index % children.length)
    }

    Animated.timing(animateTranslate, { toValue, duration }).start(() => {
      if (side === 'back' && isEndless && isResponsive && activeIndex - 1 < children.length) {
        animateTranslate.setValue(-childrenInfo.current[activeElement.index * 2 + 1][coardName])
      }

      if (side === 'next' && isEndless && isResponsive && (activeIndex + 1 >= (children.length * 2))) {
        animateTranslate.setValue(-childrenInfo.current[children.length][coardName])
      }

      setIsAnimate(false)
    })
  }, [endDrag])

  const panResponder = useMemo(() => {
    if (isSwipe && !isAnimate) {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          if (!(gestureState.dx === 0 && gestureState.dy === 0)) {
            setCaseStyle({ pointerEvents: 'box-only' })
            return true
          } else {
            return false
          }
        },
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => false,
        onStartShouldSetResponderCapture: () => false,
        onPanResponderGrant: e => {
          setAnimateTranslate(animateTranslate => {
            setStartDrag(animateTranslate._value)
            return animateTranslate
          })
        },
        onPanResponderMove: (e, gesture) => {
          setStartDrag(startDrag => {
            animateTranslate.setValue(startDrag + gesture['d' + coardName])
            return startDrag
          })
        },
        onPanResponderEnd: () => {
          setAnimateTranslate(animateTranslate => {
            setEndDrag(animateTranslate._value)
            setCaseStyle({})
            return animateTranslate
          })
        }
      })
    }

    return { panHandlers: {} }
  }, [isAnimate, rootInfo, isSwipe])

  const renderChildren = React.Children.toArray(validChildren).map((child, index, arr) => {
    const _style = StyleSheet.flatten([child.props.style])

    const sideCapitalLetter = sideName[0].toUpperCase() + sideName.slice(1)

    if (isResponsive) {
      if ((!_style['min' + sideCapitalLetter] || !_style['max' + sideCapitalLetter]) && _style['min' + sideCapitalLetter] !== '100%') {
        console.error('isResponsive need minWidth and maxWidth in children')
        return null
      }

      if (!rootInfo[sideName]) return null

      let step = 1
      let _side

      if (_style['min' + sideCapitalLetter] === '100%') {
        _style['min' + sideCapitalLetter] = rootInfo[sideName]
        _style['max' + sideCapitalLetter] = rootInfo[sideName]
        _side = rootInfo[sideName]
        step = -1
      }

      while (step !== -1) {
        _side = rootInfo[sideName] / step

        if (isNaN(_side)) break
        if (step > 10) {
          console.error('no valid minSide/maxSide')
          break
        }
        if ((_side >= _style['min' + sideCapitalLetter]) && (_side <= _style['max' + sideCapitalLetter])) {
          break
        }

        step++
      }

      if (_side && !isNaN(_side)) _style[sideName] = _side
    }

    child = React.cloneElement(child, { style: _style })

    return pug`
      View(
        key=index
        onLayout=e=> onLayoutChild(e, index)
      )= child
    `
  })

  function onLayoutRoot ({ nativeEvent }) {
    setRootInfo({
      width: Math.round(nativeEvent.layout.width),
      height: Math.round(nativeEvent.layout.height)
    })
  }

  function onLayoutCase ({ nativeEvent }) {
    setCaseInfo({
      width: Math.round(nativeEvent.layout.width),
      height: Math.round(nativeEvent.layout.height)
    })
  }

  const dots = getDotsArray({
    children,
    childrenInfo: childrenInfo.current,
    coardName,
    sideName,
    rootInfo,
    caseInfo,
    isRender,
    isEndless,
    isResponsive
  })

  return pug`
    Div.wrapper(style=[style, { opacity: isRender ? 1 : 0 }])
      Div.carousel(styleName=variant)
        if hasArrows
          Div.arrow.arrowBack(
            style=arrowBackStyle
            styleName=variant
            onPress=onBack
          )
            Icon.icon(
              style={ color: arrowBackStyle.color || '#eeeeee' }
              icon=variant === 'vertical' ? faAngleUp : faAngleLeft
              size='xxl'
            )
        View.root(
          ref=refRoot
          styleName=variant
          onLayout=onLayoutRoot
        )
          Animated.View.case(
            ref=refCase
            ...panResponder.panHandlers
            style=[
              {
                transform: [{
                  ['translate' + coardName.toUpperCase()]: animateTranslate
                }]
              },
              caseStyle
            ]
            styleName=variant
            onLayout=onLayoutCase
          )= renderChildren
        if hasArrows
          Div.arrow.arrowNext(
            style=arrowNextStyle
            styleName=variant
            onPress=onNext
          )
            Icon.icon(
              style={ color: arrowNextStyle.color || '#eeeeee' }
              icon=variant === 'vertical' ? faAngleDown : faAngleRight
              size='xxl'
            )

      if hasDots && isResponsive
        Div.dots(row)
          each _, index in dots
            Div.dot(
              key=index
              onPress=()=> toIndex(index)
              styleName={ dotActive: activeIndex === (isEndless ? (index + children.length) : index) }
            )
  `
}

function getClosest ({
  childrenInfo,
  newPosition,
  coardName,
  sideName
}) {
  let activeElement = {}

  for (let index = 0; index < childrenInfo.length; index++) {
    const item = childrenInfo[index]

    if (newPosition < item[coardName] && index === 0) {
      activeElement = { ...item, index }
      break
    }

    if (newPosition >= item[coardName] && newPosition <= (item[coardName] + item[sideName])) {
      activeElement = { ...item, index }
    }
  }

  return activeElement
}

function getDotsArray ({
  children,
  childrenInfo,
  coardName,
  sideName,
  rootInfo,
  caseInfo,
  isRender,
  isEndless,
  isResponsive
}) {
  if (!isRender) return []
  if (isEndless && isResponsive) return childrenInfo.slice(children.length * 2)

  return childrenInfo.filter(item => {
    if (!item) return false
    return Math.round(item[coardName]) <= (caseInfo[sideName] - rootInfo[sideName])
  })
}

function getValidChildren ({ children, isEndless, isResponsive, childrenRefs }) {
  const childrenWithRefs = React.Children.toArray(children)
    .map((child, index) => {
      const childRef = childrenRefs[index]
      return React.cloneElement(child, { ref: childRef })
    })
  if (isEndless && isResponsive) {
    return [...children, ...childrenWithRefs, ...children]
  }

  return childrenWithRefs
}

Carousel.defaultProps = {
  arrowBackStyle: {},
  arrowNextStyle: {},
  startIndex: 0,
  variant: 'horizontal',
  isSwipe: true,
  isLoop: false,
  isEndless: false,
  isResponsive: false,
  hasArrows: true,
  hasDots: false,
  duration: 300
}

Carousel.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  arrowBackStyle: PropTypes.object,
  arrowNextStyle: PropTypes.object,
  variant: PropTypes.string,
  startIndex: PropTypes.number,
  isSwipe: PropTypes.bool,
  isLoop: PropTypes.bool,
  isEndless: PropTypes.bool,
  isResponsive: PropTypes.bool,
  hasArrows: PropTypes.bool,
  hasDots: PropTypes.bool,
  duration: PropTypes.number,
  onChange: PropTypes.func
}

export default observer(themed('Carousel', Carousel), { forwardRef: true })
