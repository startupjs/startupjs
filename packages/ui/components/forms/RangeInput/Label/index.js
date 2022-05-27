import React from 'react'
import PropTypes from 'prop-types'
import Div from '../../../Div'
import Span from '../../../typography/Span'
import styles from './index.styl'

const width = 12

function Label ({
  oneMarkerValue,
  twoMarkerValue,
  oneMarkerLeftPosition,
  twoMarkerLeftPosition,
  oneMarkerPressed,
  twoMarkerPressed
}) {
  return pug`
    Div.root
      if Number.isFinite(oneMarkerLeftPosition) && Number.isFinite(oneMarkerValue)
        Div.label(style={ left: oneMarkerLeftPosition - width / 2 })
          Span.labelText(style=[oneMarkerPressed && styles.markerPressed])= oneMarkerValue
      if Number.isFinite(twoMarkerLeftPosition) && Number.isFinite(twoMarkerValue)
        Div.label(style={ left: twoMarkerLeftPosition - width / 2 })
          Span.labelText(style=[twoMarkerPressed && styles.markerPressed])= twoMarkerValue
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

export default Label
