import { useState, createContext, useContext } from 'react'

export const FormPropsContext = createContext()

export default function useFormProps () {
  // useState is used to avoid re-creating the object on every render
  const [empty] = useState({})
  return useContext(FormPropsContext) || empty
}
