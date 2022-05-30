import React, { useCallback } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Label from './Label'
import styles from './index.styl'

function RangeInput (props) {
  const {
    customLabel,
    max,
    min,
    options,
    hideLabel,
    step,
    value,
    width,
    containerStyle,
    selectedStyle,
    stepStyle,
    trackStyle,
    markerStyle,
    onChange,
    onChangeFinish,
    onChangeStart
  } = props
  const _twoMarkers = Array.isArray(value) && value.length > 1
  const _value = Array.isArray(value) ? value : [value] // MultiSlider requires an array for value prop

  const _onChange = useCallback((val) => {
    onChange && onChange(_twoMarkers ? val : val[0])
  }, [onChange])

  return pug`
    MultiSlider(
      customLabel=customLabel
      enableLabel=!hideLabel
      min=min
      max=max
      optionsArray=options
      sliderLength=width
      step=step
      showSteps
      values=_value
      selectedStyle=[styles.selected, selectedStyle]
      containerStyle=containerStyle,
      stepStyle=stepStyle,
      trackStyle=[styles.track, trackStyle],
      markerStyle=[styles.marker, markerStyle],
      onValuesChange=_onChange
      onValuesChangeFinish=onChangeFinish
      onValuesChangeStart=onChangeStart
    )
  `
}

const styleProp = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.array
])

RangeInput.propTypes = {
  customLabel: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.number),
  hideLabel: PropTypes.bool,
  step: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  width: PropTypes.number,
  // Style props
  containerStyle: styleProp,
  selectedStyle: styleProp,
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
  hideLabel: false,
  step: 1,
  value: 0,
  width: 280
}

export default observer(RangeInput, { forwardRef: true })
