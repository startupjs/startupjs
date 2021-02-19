import { $root, initLocalCollection } from 'startupjs'
import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _cloneDeep from 'lodash/cloneDeep'

initLocalCollection('_plugins')

// TODO: let call 1 time?
export default function registerPlugins (globalPlugins) {
  const parsePlugins = _cloneDeep(globalPlugins)

  Object.keys(globalPlugins).forEach(key => {
    const packagePlugins = globalPlugins[key]

    parsePlugins[key] = packagePlugins.map((plugin, index) => {
      try {
        let pluginObject = null
        let options = {}

        if (_isArray(plugin)) [pluginObject, options] = plugin
        else if (_isObject(plugin)) pluginObject = plugin

        /*
          if (!_isObject(pluginObject)) {
            throw new Error(`
              [@startupjs/plugin]: ${key} plugin with index ${index} is not a function or array with function
            `)
          }
        */

        return { ...pluginObject, ...options }
      } catch (err) {
        console.error(err)
      }
    })
  })

  $root.scope('_plugins.defaults').set(parsePlugins)
}
