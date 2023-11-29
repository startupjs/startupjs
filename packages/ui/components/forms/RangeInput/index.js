import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Slider } from '@miblanchard/react-native-slider'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'
import Span from '../../typography/Span'
import { getColor } from '../../../hooks/useColors'
import styles from './index.styl'

function RangeInput ({
  disabled,
  showLabel,
  min,
  max,
  range,
  showSteps,
  showStepLabels,
  showStepMarkers,
  step,
  value,
  containerStyle,
  selectedStyle,
  stepLabelStyle,
  stepMarkerStyle,
  trackMarks,
  trackStyle,
  markerStyle,
  onChange,
  onChangeFinish,
  onChangeStart
}) {
  const [_showLabel, _setShowLabel] = useState(false)

  useMemo(function () {
    if (typeof value === 'undefined' || value === null) {
      // to initialize a model with default value if it is missing
      throw new Promise(resolve => {
        (async () => {
          await onChange(range ? [min, max] : min)
          resolve()
        })()
      })
    }
  }, [])

  const _value = Array.isArray(value) && !range ? value[0] : value

  function onValueChange (value) {
    onChange && onChange(range ? value : value[0])
  }

  // note: we can not use :part because the module style props receive only an object (ViewStyle)
  // but not an array that we get after css compilation
  // todo: add a style for disabled state
  const _markerStyle = StyleSheet.flatten([
    styles.marker,
    markerStyle,
    { backgroundColor: getColor('text-on-color') } // fixme: remove it after a fix of var/color exporting
  ])
  const _trackStyle = StyleSheet.flatten([
    styles.track,
    trackStyle,
    { backgroundColor: getColor('bg-dim') }, // fixme: remove it after a fix of var/color exporting
    disabled && { opacity: 0.5 }
  ])
  // todo: add a style for disabled state
  const _minimumTrackStyle = StyleSheet.flatten([
    styles.selected,
    selectedStyle,
    { backgroundColor: getColor('bg-primary') }, // fixme: remove it after a fix of var/color exporting
    disabled && { opacity: 0.5 }
  ])
  const _containerStyle = StyleSheet.flatten([styles.container, containerStyle])

  const _trackMarks = useMemo(function () {
    if (!showSteps) {
      return null
    }
    if (trackMarks) {
      return trackMarks
    }
    let val = min
    const arr = []
    const _step = step || 1
    while (val < max - _step) {
      val += _step
      arr.push(val)
    }
    return arr
  }, [step, max, min, showSteps, trackMarks])

  const renderTrackMarkComponent = useCallback((index) => {
    if (!showSteps) {
      return null
    }

    return pug`
      Div.step
        if showStepMarkers
          Div.stepMarker(style=stepMarkerStyle)
        if showStepLabels
          Div.stepLabel(style=stepLabelStyle)= _trackMarks[index]
    `
  }, [showSteps, _trackMarks, stepLabelStyle, stepMarkerStyle])

  const renderMarkerLabel = useCallback((_, value) => {
    if (!showLabel || !_showLabel) {
      return null
    }
    return pug`
      Div.label
        Span.labelText= value
        Span.labelArrow
    `
  }, [showLabel, _showLabel])

  /**
   * todo: In upcoming version of the module marker index will be available as an argument of this function.
   *  We will be able to implement separate marker label rendering. Now we show both marker labels when we drag
   *  one of markers
   */
  const onSlidingStart = useCallback(function () {
    if (disabled) {
      return
    }
    _setShowLabel(true)
    onChangeStart && onChangeStart()
  }, [disabled, onChangeStart, _setShowLabel])

  const onSlidingComplete = useCallback(function () {
    if (disabled) {
      return
    }
    _setShowLabel(false)
    onChangeFinish && onChangeFinish()
  }, [disabled, onChangeFinish, _setShowLabel])

  return pug`
    Slider(
      animateTransitions
      disabled=disabled
      value=_value
      minimumValue=min
      maximumValue=max
      step=step
      trackMarks=_trackMarks
      containerStyle=_containerStyle
      thumbStyle=_markerStyle
      trackStyle=_trackStyle
      minimumTrackStyle=_minimumTrackStyle
      renderTrackMarkComponent=renderTrackMarkComponent
      renderAboveThumbComponent=renderMarkerLabel
      onValueChange=onValueChange
      onSlidingStart=onSlidingStart
      onSlidingComplete=onSlidingComplete
    )
  `
}

const styleProp = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.array
])

RangeInput.propTypes = {
  customLabel: PropTypes.func,
  showLabel: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  range: PropTypes.bool,
  showSteps: PropTypes.bool,
  showStepLabels: PropTypes.bool,
  showStepMarkers: PropTypes.bool,
  step: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  disabled: PropTypes.bool,
  // Style props
  containerStyle: styleProp,
  selectedStyle: styleProp,
  stepLabelStyle: styleProp,
  stepMarkerStyle: styleProp,
  trackStyle: styleProp,
  markerStyle: styleProp,
  // End style props
  onChange: PropTypes.func,
  onChangeFinish: PropTypes.func,
  onChangeStart: PropTypes.func
}

RangeInput.defaultProps = {
  disabled: false,
  max: 100,
  min: 0,
  range: false,
  showLabel: true,
  showSteps: false,
  showStepLabels: true,
  showStepMarkers: true,
  step: 1
}

export default observer(RangeInput, { forwardRef: true })
