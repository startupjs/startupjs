import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo
} from 'react'
import { Animated, Easing, Dimensions, StyleSheet } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import Portal from '../Portal'
import getGeometry from './getGeometry'
import CONSTANTS from './constants.json'
import themed from '../../theming/themed'
import './index.styl'

const { PLACEMENTS_ORDER } = CONSTANTS

function AbstractPopover (props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (props.visible) setVisible(true)
  }, [props.visible])

  function onCloseComplete (finished) {
    setVisible(false)
    props.onCloseComplete && props.onCloseComplete(finished)
  }

  if (!visible) return null

  return pug`
    Tether(
      ...props
      onCloseComplete=onCloseComplete
    )
  `
}

const Tether = observer(function TetherComponent ({
  style,
  anchorRef,
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
  onOpenComplete,
  onCloseComplete,
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
    // Also, add property that will manage where popover should appear
    // in portal or in at the place where component is called
    // maybe use PortalProvider to render it in the place where component is called
    anchorRef.current.measure((x, y, width, height, pageX, pageY) => {
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

  function animateIn () {
    onRequestOpen && onRequestOpen()

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: durationOpen,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ]).start(({ finished }) => {
      onOpenComplete && onOpenComplete(finished)
    })
  }

  function animateOut () {
    onRequestClose && onRequestClose()

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: durationClose,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(({ finished }) => {
      onCloseComplete && onCloseComplete(finished)
    })
  }

  // WORKAROUND
  // the minimum height fixes an issue where the 'onLayout' does not trigger
  // when children are undefined or have no size.
  const rootStyle = {
    top: geometry ? geometry.top : -99999,
    left: geometry ? geometry.left : -99999,
    opacity: fadeAnim,
    minHeight: 1
  }

  if (geometry) {
    rootStyle.width = geometry.width
  }

  const popover = pug`
    Animated.View.root(
      style=[style, rootStyle]
      onLayout=calculateGeometry
    )
      if arrow && !!geometry
        Div.arrow(
          style={
            borderTopColor: style.backgroundColor,
            left: geometry.arrowLeft,
            top: geometry.arrowTop
          }
          styleName=[geometry.position]
        )
      = children
  `

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
  anchorRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
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
  onOpenComplete: PropTypes.func,
  onCloseComplete: PropTypes.func
}

export default observer(themed('AbstractPopover', AbstractPopover))
