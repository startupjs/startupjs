import { createElement as el } from 'react'
import _layout from './_layout'
import hello from './hello'
import world from './world'
import index from './index'

export default [{
  path: '',
  element: el(_layout),
  children: [{
    path: '',
    element: el(index)
  }, {
    path: 'hello',
    element: el(hello)
  }, {
    path: 'world',
    element: el(world)
  }]
}]
