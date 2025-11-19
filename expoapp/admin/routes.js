import { createElement as el } from 'react'
import _layout from './_layout'
import hello from './hello'
import world from './world'
import docTest from './docTest.mdx'
import docTest2 from './docTest2.mdx'
import ButtonDocs from '../../core/ui/components/Button/Button.en.mdx'
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
  }, {
    path: 'docTest',
    element: el(docTest)
  }, {
    path: 'docTest2',
    element: el(docTest2)
  }, {
    path: 'Button',
    element: el(ButtonDocs)
  }]
}]
