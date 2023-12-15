import { Suspense, createElement as el } from 'react'
import { render } from 'react-dom'
import dummy from './startupjs.config' // has to be before Root import
import Root from './Root'

;(() => {})(dummy) // to prevent dead code elimination

const ROOT_CONTAINER_ID = 'app'

render(
  el(Suspense, { fallback: null },
    el(Root)
  ),
  document.getElementById(ROOT_CONTAINER_ID)
)
