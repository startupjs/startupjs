import { createContext, useContext } from 'react'

const MenuContext = createContext({})

export const MenuProvider = MenuContext.Provider

export function useMenuContext () {
  return useContext(MenuContext)
}
