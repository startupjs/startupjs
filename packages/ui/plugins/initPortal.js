import React from 'react'
import { observer } from 'startupjs'
import Portal from '../components/Portal'

const initPortal = {
  initWrapper: observer(({ children }) => pug`
    Portal.Provider= children
  `)
}

export default initPortal
