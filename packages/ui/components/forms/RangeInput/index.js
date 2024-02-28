import React, { useMemo } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Label from './Label'
import './index.styl'

function RangeInput ({
  customLabel,
  showLabel,
  min,
  max,
  range,
  showSteps,
  showStepLabels,
  showStepMarkers,
  step,
  value,
  width,
  onChange,
  onChangeFinish,
  onChangeStart
}) {
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

  // vendor component requires an array in any case
  const values = Array.isArray(value) ? value : [value]

  function onValuesChange (value) {
    onChange && onChange(range ? value : value[0])
  }

  return pug`
    MultiSlider.root(
      customLabel=customLabel
      enableLabel=showLabel
      enabledTwo=range
      min=min
      max=max
      showSteps=showSteps
      showStepLabels=showStepLabels
      showStepMarkers=showStepMarkers
      sliderLength=width
      snapped
      step=step
      values=values
      onValuesChange=onValuesChange
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
  showLabel: true,
  showSteps: false,
  showStepLabels: true,
  showStepMarkers: true,
  step: 1,
  width: 280
}

export default observer(RangeInput)
