import React from 'react'
import propTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import { observer } from 'startupjs'
import Row from './../Row'
import { H6 } from './../Headers'
import Star from './Star'
import './index.styl'
const AMOUNT = 5
const ITEMS = Array(AMOUNT).fill(null)

function Rating ({
  value,
  readonly
}) {
  return pug`
    Row.root(vAlign='center' align='between' styleName={readonly})
      if readonly
        Star.star(active)
        H6(bold)= Number.isInteger(value) ? value : value.toFixed(1)
      else
        each ITEM, index in ITEMS
          TouchableOpacity
            Star(key=index active=index < Math.round(value))
  `
}

Rating.defaultProps = {
  value: 0,
  readonly: false
}

Rating.propTypes = {
  value: propTypes.number,
  readonly: propTypes.bool,
  onChange: propTypes.func
}

export default observer(Rating)
