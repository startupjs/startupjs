import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'

const ROOT_CONTAINER_ID = 'app'

ReactDOM.render(
  <React.Suspense fallback={null}><Root /></React.Suspense>,
  document.getElementById(ROOT_CONTAINER_ID)
)
