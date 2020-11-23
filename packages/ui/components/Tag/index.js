import React from 'react'
import { observer } from 'startupjs'
import Button from '../Button'

function Tag (props) {
  return pug`
    //- button is clickable by default, override this behavior
    Button(
      ...props
      size='xs'
    )
  `
}

Tag.defaultProps = {
  ...Button.defaultProps,
  color: 'primary',
  variant: 'flat',
  shape: 'circle'
}

export default observer(Tag)
