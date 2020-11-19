import React from 'react'
import { observer } from 'startupjs'
import Div from '../../Div'
import Span from '../../typography/Span'

function ExampleTab ({ bgColor }) {
  return pug`
    Div(
      style={
        backgroundColor: bgColor,
        width: '100%',
        height: 500,
        justifyContent: 'center',
        alignItems: 'center'
      }
    )
      Span(
        style={
          color: 'white',
          fontSize: 30,
          lineHeight: 35
        }
      ) Some tab
  `
}

export default observer(ExampleTab)
