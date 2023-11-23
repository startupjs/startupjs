import { Suspense, createElement as el } from 'react'
import { render } from 'react-dom'
import Root from './Root'

const ROOT_CONTAINER_ID = 'app'

render(
  el(Suspense, { fallback: null },
    el(Root)
  ),
  document.getElementById(ROOT_CONTAINER_ID)
)
