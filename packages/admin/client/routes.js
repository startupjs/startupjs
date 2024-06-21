import { createElement as el } from 'react'
import MODULE from '../module'
import _layout from './_layout'
import index from './index'

export default [{
  path: '',
  element: el(_layout),
  children: [
    { path: '', element: el(index) },
    ...MODULE.hook('routes').flat()
  ]
}]
