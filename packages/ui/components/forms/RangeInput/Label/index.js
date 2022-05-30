import React, { useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Div from '../../../Div'
import Span from '../../../typography/Span'
import './index.styl'

function Label ({
  oneMarkerValue,
  twoMarkerValue,
  oneMarkerLeftPosition,
  twoMarkerLeftPosition,
  oneMarkerPressed,
  twoMarkerPressed
}) {
  const oneRef = useRef(null)
  const twoRef = useRef(null)
  const oneWidth = useElementWidth(oneRef, oneMarkerValue)
  const twoWidth = useElementWidth(twoRef, twoMarkerValue)

  return pug`
    Div.root
      if Number.isFinite(oneMarkerLeftPosition) && Number.isFinite(oneMarkerValue)
        Div.label(
          ref=oneRef
          style={ left: oneMarkerLeftPosition - oneWidth / 2 }
        )
          Span.labelText(styleName={ pressed: oneMarkerPressed })= oneMarkerValue
      if Number.isFinite(twoMarkerLeftPosition) && Number.isFinite(twoMarkerValue)
        Div.label(
          ref=twoRef
          style={ left: twoMarkerLeftPosition - twoWidth / 2 }
        )
          Span.labelText(styleName={ pressed: twoMarkerPressed })= twoMarkerValue
  `
}

Label.propTypes = {
  oneMarkerValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  twoMarkerValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  oneMarkerLeftPosition: PropTypes.number,
  twoMarkerLeftPosition: PropTypes.number,
  oneMarkerPressed: PropTypes.bool,
  twoMarkerPressed: PropTypes.bool
}

function useElementWidth (ref, dependency) {
  const [value, setValue] = useState(0)

  useLayoutEffect(function () {
    ref.current?.measure(function (x, y, width) {
      setValue(width)
    })
  }, [ref.current, dependency])

  return value
}

export default Label
