import React, { useContext } from 'react'

const CustomInputsContext = React.createContext()

export default CustomInputsContext

export function useCustomInputs () {
  return useContext(CustomInputsContext)
}
