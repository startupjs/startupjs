import React, {
  useState,
  useImperativeHandle,
  useCallback,
  useEffect,
  useRef,
  useMemo
} from 'react'
import { Animated, Easing, Dimensions, StyleSheet } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../../Div'
import Portal from '../../../Portal'
import getGeometry from './getGeometry'
import { PLACEMENTS_ORDER } from '../constants.json'
import themed from '../../../../theming/themed'
import './index.styl'

function AbstractPopover ({
  visible,
  ...props
}, ref) {
  const [localVisible, setLocalVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => setLocalVisible(true),
    close: () => setLocalVisible(false)
  }), [])

  const actualVisible = visible === undefined
    ? localVisible
    : visible

  return pug`
    BasePopover(
      visible=actualVisible
      ...props
    )
  `
}

const BasePopover = observer(function BasePopoverComponent (props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (props.visible) setVisible(true)
  }, [props.visible])

  const onCloseComplete = useCallback((finished) => {
    setVisible(false)
    props.onCloseComplete && props.onCloseComplete(finished)
  }, [])

  if (!visible) return null

  return pug`
    Tether(
      ...props
      onCompleteClose=onCloseComplete
    )
  `
})

const Tether = observer(function TetherComponent ({
  style,
  arrowStyle,
  refAnchor,
  visible,
  position,
  attachment,
  // IDEA: Is this property is redundant?
  // We can always find a better position if the specified position does not fit
  // Also we can use the same logic like in tether.io
  placements,
  arrow,
  matchAnchorWidth,
  durationOpen,
  durationClose,
  renderWrapper,
  onRequestOpen,
  onRequestClose,
  onCompleteOpen,
  onCompleteClose,
  children
}) {
  style = StyleSheet.flatten([style])
  if (!renderWrapper) renderWrapper = children => children

  const [geometry, setGeometry] = useState()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const dimensions = useMemo(() => ({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }), [])

  useEffect(() => {
    console.log(visible, geometry)

    if (!geometry) return

    if (visible) {
      animateIn()
    } else {
      animateOut()
    }
  }, [visible, !!geometry])

  const calculateGeometry = useCallback(({ nativeEvent }) => {
    // IDEA: we can pass measures to this component
    // instead of passing ref for the measurement
    refAnchor.current.measure((x, y, width, height, pageX, pageY) => {
      // IDEA: rewrite getGeometry in future
      // we can make geometry behaviout like in tether.js
      const geometry = getGeometry({
        placement: position + '-' + attachment,
        placements,
        arrow,
        matchAnchorWidth,
        dimensions,
        tetherMeasures: nativeEvent.layout,
        anchorMeasures: { x, y, width, height, pageX, pageY }
      })
      setGeometry(geometry)
    })
  }, [])

  const animateIn = useCallback(() => {
    console.log('animateIn')

    onRequestOpen && onRequestOpen()

    console.log('onRequestOpen')
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: durationOpen,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ]).start(({ finished }) => {
      onCompleteOpen && onCompleteOpen(finished)
    })
  }, [])

  const animateOut = useCallback(() => {
    onRequestClose && onRequestClose()

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: durationClose,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(({ finished }) => {
      onCompleteClose && onCompleteClose(finished)
    })
  }, [])

  const rootStyle = {
    top: geometry ? geometry.top : -999,
    left: geometry ? geometry.left : -999,
    width: geometry ? geometry.width : 'auto',
    opacity: fadeAnim
  }

  const popover = pug`
    Animated.View.root(
      style=[style, rootStyle]
      onLayout=calculateGeometry
    )
      if arrow && !!geometry
        Div.arrow(
          style=[
            arrowStyle,
            {
              borderTopColor: style.backgroundColor,
              left: geometry.arrowLeft,
              top: geometry.arrowTop
            }
          ]
          styleName=[geometry.position]
        )
      = children
  `

  console.log(renderWrapper(popover))

  return pug`
    Portal
      = renderWrapper(popover)
  `
})

AbstractPopover.defaultProps = {
  position: 'bottom',
  attachment: 'start',
  placements: PLACEMENTS_ORDER,
  arrow: false,
  matchAnchorWidth: false,
  durationOpen: 100,
  durationClose: 50
}

AbstractPopover.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  arrowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  refAnchor: PropTypes.any,
  visible: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  placements: PropTypes.arrayOf(PropTypes.oneOf(PLACEMENTS_ORDER)),
  arrow: PropTypes.bool,
  matchAnchorWidth: PropTypes.bool,
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number,
  renderWrapper: PropTypes.func,
  children: PropTypes.node,
  onRequestOpen: PropTypes.func,
  onRequestClose: PropTypes.func,
  onCompleteOpen: PropTypes.func,
  onCompleteClose: PropTypes.func
}

export default observer(
  themed('AbstractPopover', AbstractPopover),
  { forwardRef: true }
)
