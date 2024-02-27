import { createContext, useContext, useState } from 'react'

export const ExtraInputsContext = createContext()

export default function useExtraInputs () {
  // useState is used to avoid re-creating the object on every render
  const [empty] = useState({})
  return useContext(ExtraInputsContext) || empty
}
