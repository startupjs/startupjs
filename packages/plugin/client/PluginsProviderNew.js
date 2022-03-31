import React, { createContext, useContext } from 'react'
import useInstancePlugins from './useInstancePlugins'

const PluginsContext = createContext({})

export function PluginsProviderNew ({ children, name, plugins = {} }) {
  const [filterPlugins, mergeOptions] = useInstancePlugins(name, plugins)

  return pug`
    PluginsContext.Provider(value=[filterPlugins, mergeOptions])
      = children
  `
}

export function usePlugins () {
  const [plugins] = useContext(PluginsContext)
  return plugins
}

export function useOptions () {
  const [, options] = useContext(PluginsContext)
  return options
}
