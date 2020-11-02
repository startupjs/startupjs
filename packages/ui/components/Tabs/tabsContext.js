import { createContext, useContext } from 'react'

const TabsContext = createContext({})

export const TabsProvider = TabsContext.Provider

export function useTabsContext () {
  return useContext(TabsContext)
}
