import React from 'react'
import { pug } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../../Div'
import Span from '../../../typography/Span'
import styles from './index.styl'

function Label ({
  oneMarkerValue,
  twoMarkerValue,
  oneMarkerLeftPosition,
  twoMarkerLeftPosition,
  oneMarkerPressed,
  twoMarkerPressed
}) {
  // Number.isFinite - This condition has been taken from original vendor component.
  // Be aware when you change this.
  const showOne = oneMarkerPressed && Number.isFinite(oneMarkerLeftPosition) &&
    Number.isFinite(oneMarkerValue)
  const shoTwo = twoMarkerPressed && Number.isFinite(twoMarkerLeftPosition) &&
    Number.isFinite(twoMarkerValue)

  return pug`
    Div.root
      if showOne
        = renderLabel(oneMarkerLeftPosition, oneMarkerValue)
      if shoTwo
        =renderLabel(twoMarkerLeftPosition, twoMarkerValue)
  `
}

function renderLabel (position, value) {
  return pug`
    Div.label(style={ left: position - styles.label.width / 2 })
      // todo: implement common tooltip style
      Span.text= value
      Span.arrow
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
