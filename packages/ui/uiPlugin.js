import React from 'react'
import { observer } from 'startupjs'
import Portal from './components/Portal'

// TODO: rename plugin key?
export default {
  name: 'ui',
  func: options => {
    return {
      LayoutWrapper: observer(({ children }) => {
        return pug`
          Portal.Provider= children
        `
      })
    }
  }
}
