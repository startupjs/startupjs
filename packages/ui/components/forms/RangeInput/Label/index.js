import React from 'react'
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
  return pug`
    Div.root
      // This condition has been taken from original vendor component. Be aware when you change this.
      if Number.isFinite(oneMarkerLeftPosition) && Number.isFinite(oneMarkerValue)
        Div.label(style={ left: oneMarkerLeftPosition - styles.label.width / 2 })
          Span.text(styleName={ pressed: oneMarkerPressed })= oneMarkerValue
      // This condition has been taken from original vendor component. Be aware when you change this.
      if Number.isFinite(twoMarkerLeftPosition) && Number.isFinite(twoMarkerValue)
        Div.label(style={ left: twoMarkerLeftPosition - styles.label.width / 2 })
          Span.text(styleName={ pressed: twoMarkerPressed })= twoMarkerValue
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
