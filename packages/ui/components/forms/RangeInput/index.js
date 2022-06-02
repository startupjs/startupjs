import React, { useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Label from './Label'
import styles from './index.styl'

function RangeInput (props) {
  const {
    customLabel,
    showLabel,
    min,
    max,
    range,
    showSteps,
    step,
    value,
    width,
    containerStyle,
    selectedStyle,
    stepLabelStyle,
    stepMarkerStyle,
    stepStyle,
    trackStyle,
    markerStyle,
    onChange,
    onChangeFinish,
    onChangeStart
  } = props

  let _value = useMemo(function () {
    let val = value
    // vendor component expects an array
    if (value === undefined || value === null) {
      val = range ? [min, max] : [min]

      throw new Promise((resolve) => {
        (async () => {
          await onChange(val)
          resolve()
        })()
      })
    }

    return val
  }, [range, value, min, max])

  // to initialize a model with default values if they absent

  const _onChange = useCallback((val) => {
    onChange && onChange(range ? val : val[0])
  }, [onChange])

  return pug`
    MultiSlider(
      customLabel=customLabel
      enableLabel=showLabel
      enabledTwo=range
      min=min
      max=max
      sliderLength=width
      step=step
      showSteps=showSteps
      showStepMarkers=showSteps
      values=_value
      selectedStyle=StyleSheet.flatten([styles.selected, selectedStyle])
      containerStyle=containerStyle,
      stepLabelStyle=StyleSheet.flatten([styles.stepLabel, stepLabelStyle]),
      stepMarkerStyle=StyleSheet.flatten([styles.stepMarker, stepMarkerStyle])
      stepStyle=stepStyle
      trackStyle=StyleSheet.flatten([styles.track, trackStyle]),
      markerStyle=StyleSheet.flatten([styles.marker, markerStyle]),
      onValuesChange=_onChange
      onValuesChangeFinish=onChangeFinish
      onValuesChangeStart=onChangeStart
      snapped
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
  step: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  width: PropTypes.number,
  // Style props
  containerStyle: styleProp,
  selectedStyle: styleProp,
  stepLabelStyle: styleProp,
  stepMarkerStyle: styleProp,
  stepStyle: styleProp,
  trackStyle: styleProp,
  markerStyle: styleProp,
  // End style props
  onChange: PropTypes.func,
  onChangeFinish: PropTypes.func,
  onChangeStart: PropTypes.func
}

RangeInput.defaultProps = {
  customLabel: Label,
  max: 100,
  min: 0,
  range: false,
  showSteps: false,
  showLabel: true,
  step: 1,
  width: 280
}

export default observer(RangeInput, { forwardRef: true })
