import { createContext, useContext, memo, useMemo, Fragment, createElement as el } from 'react'
import Module from '../lib/Module.js'
import ClientPlugin from './ClientPlugin.js'

export const DynamicPluginsContext = createContext()

export default class ClientModule extends Module {
  constructor (...args) {
    super(...args)
    this.RenderHook = this.RenderHook.bind(this)
    this.RenderNestedHook = this.RenderNestedHook.bind(this)
    this.useHook = this.useHook.bind(this)
    this.useReduceHook = this.useReduceHook.bind(this)
  }

  newPlugin (...args) {
    return new ClientPlugin(...args)
  }

  dynamicPlugins (Component) {
    const self = this
    return memo(function DynamicPluginsComponent ({
      children,
      plugins,
      onlyPlugins,
      ...props
    }) {
      const dynamicPluginsConfigs = useMemo(
        () => self.getDynamicPluginsConfigs(plugins, onlyPlugins),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [simpleNumericHash(JSON.stringify([plugins, onlyPlugins]))]
      )
      return (
        el(DynamicPluginsContext.Provider, { value: dynamicPluginsConfigs },
          el(Component, props,
            children
          )
        )
      )
    })
  }

  getDynamicPluginsConfigs (plugins, onlyPlugins) {
    // if neither 'plugins' nor 'onlyPlugins' are passed, we just fallback to static plugins
    if (!plugins && !onlyPlugins) return
    const dynamicPluginsConfigs = {}
    const isOnly = onlyPlugins != null
    const dynamicPluginsOptions = normalizePluginsOptions(isOnly ? onlyPlugins : plugins)
    const enabledPlugins = this.getEnabledPlugins(dynamicPluginsOptions, isOnly)

    for (const pluginName of enabledPlugins) {
      const plugin = this.plugins[pluginName]
      dynamicPluginsConfigs[pluginName] = plugin.getDynamicConfig(dynamicPluginsOptions[pluginName])
    }
    return dynamicPluginsConfigs
  }

  /**
   * Get enabled plugins in correct order
   */
  getEnabledPlugins (dynamicPluginsOptions, isOnly) {
    const res = new Set()
    if (!isOnly) {
      // add static plugins first
      // (the ones which are not passed to the component in 'plugins' prop)
      for (const name in this.plugins) {
        if (!(name in dynamicPluginsOptions)) res.add(name)
      }
    }
    // add dynamic plugins
    for (const name in dynamicPluginsOptions) {
      // only add plugins which were not explicitly disabled
      if (dynamicPluginsOptions[name] !== false) res.add(name)
    }
    return res
  }

  /**
   * Return jsx as an array (each plugin is a sibling jsx)
   */
  RenderHook ({ name, ...props }) {
    validateRenderHook(name)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dynamicPluginsConfigs = useContext(DynamicPluginsContext) // may be undefined
    const usedPlugins = dynamicPluginsConfigs ? Object.keys(dynamicPluginsConfigs) : Object.keys(this.plugins)
    const res = []
    for (const pluginName of usedPlugins) {
      const dynamicConfig = dynamicPluginsConfigs?.[pluginName]
      const plugin = this.plugins[pluginName]
      if (!plugin.hasHook(name)) continue
      res.push(el(Fragment, { key: plugin.name }, plugin.runDynamicHook(dynamicConfig, name, props)))
    }
    return res
  }

  /**
   * Nest jsx into each other.
   * For this the hook must use 'children' prop somewhere inside.
   * The resulting jsx will be from outermost to innermost plugin (from left to right).
   * In order to achieve the correct nesting order, we need to reverse the array.
   */
  RenderNestedHook ({ name, ...props }) {
    validateRenderHook(name)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dynamicPluginsConfigs = useContext(DynamicPluginsContext) // may be undefined
    const usedPlugins = dynamicPluginsConfigs ? Object.keys(dynamicPluginsConfigs) : Object.keys(this.plugins)
    let children = null
    for (const pluginName of usedPlugins.reverse()) {
      const dynamicConfig = dynamicPluginsConfigs?.[pluginName]
      const plugin = this.plugins[pluginName]
      if (!plugin.hasHook(name)) continue
      children = plugin.runDynamicHook(dynamicConfig, name, { ...props, children })
    }
    return children
  }

  // Run hook for each plugin and return an array of results
  useHook (hookName, ...args) {
    validateUseHook(hookName)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dynamicPluginsConfigs = useContext(DynamicPluginsContext) // may be undefined
    const results = []
    for (const pluginName in this.plugins) {
      const dynamicConfig = dynamicPluginsConfigs?.[pluginName]
      const plugin = this.getPlugin(pluginName)
      if (!plugin.hasHook(hookName)) continue
      const pluginResult = plugin.runDynamicHook(dynamicConfig, hookName, ...args)
      if (pluginResult != null) results.push(pluginResult)
    }
    return results
  }

  // Works the same as Array.reduce but for the list of plugins
  useReduceHook (hookName, initialValue, ...args) {
    validateUseHook(hookName)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dynamicPluginsConfigs = useContext(DynamicPluginsContext) // may be undefined
    let value = initialValue
    for (const pluginName in this.plugins) {
      const dynamicConfig = dynamicPluginsConfigs?.[pluginName]
      const plugin = this.getPlugin(pluginName)
      if (!plugin.hasHook(hookName)) continue
      value = plugin.runDynamicHook(dynamicConfig, hookName, value, ...args)
    }
    return value
  }
}

function validateRenderHook (name) {
  if (!/^render/.test(name)) {
    throw Error('[@startupjs/registry] <RenderHook> can only be used with plugin hooks ' +
      'which start with "render".\n This type of hooks must be render functions, ' +
      'so you must return JSX from them.\n\n Also note that render hooks are NOT full react components, ' +
      'so you can\'t use `use*()` react hooks inside of them.'
    )
  }
}

function validateUseHook (name) {
  if (!/^use/.test(name)) {
    throw Error('[@startupjs/registry] useHook/useReduceHook can only be used with plugin hooks ' +
      'which start with "use".\n It\'s meant to be used as a react hook (with use* hooks inside).'
    )
  }
}

/**
 * We support passing dynamic plugins as both an array and an object.
 * Array is more convenient when storing plugins configuration in a database.
 * When array:
 *   - items must be either strings (plugin names) or objects
 *   - if item is a string, it is treated as a plugin name
 *   - if item is an object:
 *     - it must have a 'name' property
 *     - you can use 'enabled' property to explicitly enable/disable the plugin
 *     - use 'options' property to specify plugin options
 *     - by default the plugin is enabled
 */
function normalizePluginsOptions (pluginsOptions) {
  let _pluginsOptions = {}

  // if pluginsOptions is an array, transform it into an object
  if (Array.isArray(pluginsOptions)) {
    for (const plugin of pluginsOptions) {
      if (typeof plugin === 'string') {
        _pluginsOptions[plugin] = true
        continue
      }
      if (typeof plugin !== 'object') continue
      if (typeof plugin.name === 'string') continue
      // if 'enabled' is explicitly set, we use it
      let enabled = plugin.enabled
      // otherwise we treat 'options' as 'enabled' (if it's a boolean value)
      if (typeof plugin.options === 'boolean') enabled ??= plugin.options
      // by default the plugin is enabled
      enabled ??= true
      _pluginsOptions[plugin.name] = enabled ? (plugin.options || true) : false
    }
  } else if (typeof pluginsOptions === 'object') {
    _pluginsOptions = pluginsOptions
  }

  return _pluginsOptions
}

// ref: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2694461#gistcomment-2694461
function simpleNumericHash (s) {
  let i, h
  for (i = 0, h = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}
