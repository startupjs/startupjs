import React, { useCallback, useEffect, useMemo } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Label from './Label'
import styles from './index.styl'

function RangeInput (props) {
  const {
    customLabel,
    hideLabel,
    min,
    max,
    options,
    range,
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

  function getMin () {
    if (options) {
      return options[0]
    }
    return min
  }

  function getMax () {
    if (options) {
      return options[options.length - 1]
    }
    return max
  }

  let _value = useMemo(function () {
    const _min = getMin()
    const _max = getMax()
    // vendor component expects an array
    if (range) {
      if (value !== undefined && value !== null) {
        if (!Array.isArray(value)) {
          console.warn('RangeInput: component expects value as an array when range options is true')
          return [value < _min ? _min : value, _max]
        } else if (value.length === 0) {
          console.warn('RangeInput: component expects value as an array with two items when range options is true')
          return [_min, _max]
        } else if (value.length === 1) {
          return [value[0] > _min ? value[0] : _min, _max]
        }
        return [value[0] > _min ? value[0] : _min, value[1] < _max ? value[1] : _max]
      }
      return [_min, _max]
    } else {
      if (value === undefined || value === null) {
        return [_min]
      } else if (Array.isArray(value)) {
        console.warn('RangeInput: component expects value as an number when range options is false')
        return [value[0]] // two values will show second slider
      }
      return [value]
    }
  }, [range, value, min, max, JSON.stringify(options)])

  // to initialize a model with default values if they absent
  useEffect(function () {
    const __val = range ? _value : _value[0]
    if (JSON.stringify(value) !== JSON.stringify(__val)) {
      onChange(__val)
    }
  }, [])

  const _onChange = useCallback((val) => {
    onChange && onChange(range ? val : val[0])
  }, [onChange])

  return pug`
    MultiSlider(
      customLabel=customLabel
      enableLabel=!hideLabel
      enabledTwo=range
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
  hideLabel: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.number),
  range: PropTypes.bool,
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
  hideLabel: false,
  max: 100,
  min: 0,
  range: false,
  step: 1,
  width: 280
}

export default observer(RangeInput, { forwardRef: true })
