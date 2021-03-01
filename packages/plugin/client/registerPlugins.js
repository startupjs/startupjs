import { $root, initLocalCollection } from 'startupjs'
import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _cloneDeep from 'lodash/cloneDeep'
import _merge from 'lodash/merge'

initLocalCollection('_plugins')

// TODO: let call 1 time?
export default function registerPlugins (initPlugins) {
  const allPlugins = _cloneDeep(initPlugins)

  Object.keys(allPlugins).forEach(packageName => {
    const packagePlugins = allPlugins[packageName]

    allPlugins[packageName] = packagePlugins.map(packagePlugin => {
      try {
        let pluginStructure = null
        let manageOptions = {}

        if (_isArray(packagePlugin)) [pluginStructure, manageOptions] = packagePlugin
        else if (_isObject(packagePlugin)) pluginStructure = packagePlugin

        return _merge({}, pluginStructure, manageOptions)
      } catch (err) {
        console.error(err)
      }
    })
  })

  $root.scope('_plugins.defaults').set(allPlugins)
}
