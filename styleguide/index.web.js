import { Suspense, createElement as el } from 'react'
import { render } from 'react-dom'
import './startupjs.config' // has to be before Root import
import Root from './Root'

const ROOT_CONTAINER_ID = 'app'

render(
  el(Suspense, { fallback: null },
    el(Root)
  ),
  document.getElementById(ROOT_CONTAINER_ID)
)
