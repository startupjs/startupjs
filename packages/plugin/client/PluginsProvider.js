import React, { createContext, useContext } from 'react'
import useComponentPlugins from './useComponentPlugins'

const PluginsContext = createContext({})

export function PluginsProvider ({ children, name, plugins = [] }) {
  const [_plugins] = useComponentPlugins(name, plugins)

  return pug`
    PluginsContext.Provider(value=_plugins)
      = children
  `
}

export function usePlugins () {
  return useContext(PluginsContext)
}
