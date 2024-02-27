import { createContext, useContext, useState } from 'react'

export const CustomInputsContext = createContext()

export default function useCustomInputs () {
  // useState is used to avoid re-creating the object on every render
  const [empty] = useState({})
  return useContext(CustomInputsContext) || empty
}
