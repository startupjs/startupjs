import React, { useContext } from 'react'

const StyleContext = React.createContext()

export default StyleContext

export function useStyle () {
  return useContext(StyleContext)
}
