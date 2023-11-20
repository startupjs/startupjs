import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Tag from './../../Tag'
import themed from '../../../theming/themed'
import './index.styl'

function DefaultTag ({
  index,
  record,
  isLast
}) {
  return pug`
    Tag.tag(
      styleName={last: isLast}
      size='s'
      variant='flat'
      color='primary'
    )= record.label
  `
}

DefaultTag.propTypes = {
  index: PropTypes.number,
  record: PropTypes.object
}

export default observer(themed('Multiselect', DefaultTag))
