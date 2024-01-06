// TODO: experiment with trying to combine all startupjs-related babel plugins into one preset
// Following is an experiment for combining all startupjs-related babel plugins into one preset
// and running it all together in one babel transform.
// The 'babel-preset-startupjs/full' preset also does check for the magic libraries within
// babel itself through the skippablePreset.js hack.
// Drawbacks of this approach:
//   it still requires running transformation separately from the underlying expo/metro babel transform
//   and just putting this preset into babel config doesn't work.

const wrappedPluginsCache = new WeakMap()
const skippablePluginCache = new WeakMap()
const skippableSymbol = Symbol('skip this babel plugin')

module.exports = function skippablePreset (testFn, preset) {
  const skippablePlugin = getSkippablePlugin(testFn)
  return function (...args) {
    const res = preset.call(this, ...args)
    if (res.plugins) {
      res.plugins = wrapPlugins(res.plugins)
      res.plugins.unshift(skippablePlugin)
    }
    if (res.overrides) {
      res.overrides = res.overrides.map(override => {
        if (!override.plugins) return override
        override.plugins = wrapPlugins(override.plugins)
        return override
      })
      res.overrides.unshift({
        plugins: [skippablePlugin] // '@babel/plugin-syntax-flow',
      })
    }
    return res
  }
}

function wrapPlugins (plugins) {
  return plugins.map(plugin => {
    if (Array.isArray(plugin)) {
      const [pluginFn, ...rest] = plugin
      return [skippable(pluginFn), ...rest]
    } else if (typeof plugin === 'function') {
      return skippable(plugin)
    } else if (typeof plugin === 'string') {
      return skippable(require(plugin))
    } else {
      return plugin
    }
  })
}

function skippable (plugin) {
  if (typeof plugin === 'object' && plugin.default) plugin = plugin.default
  if (typeof plugin !== 'function') throw Error('skippablePreset: babel plugin is not a function')
  let wrappedPlugin = wrappedPluginsCache.get(plugin)
  if (wrappedPlugin) return wrappedPlugin
  wrappedPlugin = function (...args) {
    const res = plugin.call(this, ...args)
    if (!res?.visitor) return res

    // pre
    const oldPre = res.pre
    const newPre = function (state, ...args) {
      if (state[skippableSymbol]) return
      return oldPre?.call(this, state, ...args)
    }
    if (oldPre) res.pre = newPre

    // Program.enter
    let oldProgramEnter = res.visitor.Program?.enter || res.visitor.Program
    if (typeof oldProgramEnter !== 'function') oldProgramEnter = undefined
    const newProgramEnter = function ($program, state, ...args) {
      if (state.file[skippableSymbol]) {
        return $program.stop()
      }
      return oldProgramEnter?.call(this, $program, state, ...args)
    }
    if (typeof res.visitor.Program === 'object') {
      res.visitor.Program.enter = newProgramEnter
    } else {
      res.visitor.Program = newProgramEnter
    }

    // Program.exit
    const oldProgramExit = res.visitor.Program?.exit
    const newProgramExit = function ($program, state, ...args) {
      if (state.file[skippableSymbol]) return
      return oldProgramExit?.call(this, $program, state, ...args)
    }
    if (oldProgramExit) res.visitor.Program.exit = newProgramExit

    // post
    const oldPost = res.post
    const newPost = function (state, ...args) {
      if (state[skippableSymbol]) return
      return oldPost?.call(this, state, ...args)
    }
    if (oldPost) res.post = newPost

    return res
  }
  wrappedPluginsCache.set(plugin, wrappedPlugin)
  return wrappedPlugin
}

function getSkippablePlugin (testFn) {
  let skippablePlugin = skippablePluginCache.get(testFn)
  if (skippablePlugin) return skippablePlugin
  skippablePlugin = function skippablePlugin () {
    return {
      pre (state) {
        if (!(state.code && testFn(state.code))) {
          state[skippableSymbol] = true
        }
      }
    }
  }
  skippablePluginCache.set(testFn, skippablePlugin)
  return skippablePlugin
}
