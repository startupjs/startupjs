import React from 'react'
import { observer } from 'startupjs'
import { Props } from 'components'
import { Text } from 'react-native'
import propTypes from 'prop-types'
import './index.styl'

export default observer(function PComponent () {
  return pug`
    Props(Component=RenderText)
  `
})

function RenderText ({ value, age, children, variant, highlight }) {
  return pug`
    Text My Value: #{value}
    Text My age: #{age}
    Text Variant: #{variant}
    Text Highlight: #{JSON.stringify(highlight)}
    Text Children: #{children}
  `
}

RenderText.propTypes = {
  value: propTypes.string,
  age: propTypes.number,
  variant: propTypes.oneOf(['normal', 'compact', 'pure']),
  highlight: propTypes.bool,
  children: propTypes.node
}

RenderText.defaultProps = {
  value: 'Hello',
  age: 10,
  variant: 'normal',
  highlight: true
}
