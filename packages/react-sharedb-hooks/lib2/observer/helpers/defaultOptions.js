import * as React from 'react'

export default {
  forwardRef: false,
  suspenseProps: {
    fallback: React.createElement(NullComponent, null, null)
  }
}

function NullComponent () {
  return null
}
