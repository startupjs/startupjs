import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'
import themed from '../../../theming/themed'
import './index.styl'

function Thead ({ style, children, bordered, ...props }) {
  return pug`
    Div(
      ...props
      style=[style]
      styleName=[{ bordered }]
    )= children
  `
}

Thead.defaultProps = {
  bordered: true
}

Thead.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  bordered: PropTypes.bool
}

export default observer(themed('Thead', Thead))
