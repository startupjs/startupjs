import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Div from './../Div'
import Row from './../Row'
import H6 from './../typography/H6'
import Star from './Star'
import './index.styl'
const AMOUNT = 5
const ITEMS = Array(AMOUNT).fill(null)

function Rating ({
  style,
  value,
  readonly,
  onChange
}) {
  return pug`
    Row.root(style=style vAlign='center' align='between' styleName={readonly})
      if readonly
        Star(active)
        H6(bold)= Number.isInteger(value) ? value : value.toFixed(1)
      else
        each ITEM, index in ITEMS
          Div(key=index onPress=() => onChange && onChange(index + 1))
            Star(active=index < Math.round(value))
  `
}

Rating.defaultProps = {
  value: 0,
  readonly: false
}

Rating.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  value: propTypes.number,
  readonly: propTypes.bool,
  onChange: propTypes.func
}

export default observer(Rating)
