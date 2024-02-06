export const ORDER_PREFIXES = ['before', 'system', 'exactly', 'after']
export const DEFAULT_ORDER_PREFIX = 'exactly'
// order groups which you can specify in plugin.order
// Additionally, 'before <group>' and 'after <group>' can be used
export const ORDER_GROUPS = [
  'first',
  'root',
  'session',
  'api',
  'pure', // for pure startupjs plugins which don't depend on 'ui' or 'router' being present
  'ui', // for plugins which depend on 'ui' being present and initialized
  'router', // for plugins which depend on 'router' being present and initialized
  'default', // this is the default group which executes after everything else
  'last'
]
export const DEFAULT_ORDER_GROUP = 'default'

/**
 * Split plugins into groups to sort them by the 'order' field
 * @param {Array} pluginNames
 * @param {Function} getPluginOrder - function that receive plugin name and return order string
 * @returns {Array} sortedPlugins
 */
export default function sortPlugins (pluginNames = [], getPluginOrder) {
  if (!getPluginOrder) throw Error('getPluginOrder is required')
  const groups = {}
  for (const pluginName of pluginNames) {
    const order = sanitizeOrder(getPluginOrder(pluginName) || '')
    if (!groups[order]) groups[order] = []
    groups[order].push(pluginName)
  }
  // concat all groups in order
  const orderedPlugins = []
  for (const groupName of ORDER_GROUPS) {
    for (const prefix of ORDER_PREFIXES) {
      const order = `${prefix} ${groupName}`
      if (groups[order]) orderedPlugins.push(...groups[order])
    }
  }
  return orderedPlugins
}

export function sanitizeOrder (order) {
  if (typeof order !== 'string') throw Error(`order must be a string. Got: "${order}"`)
  if (/(?:^\s|\s\s|\s$)/.test(order)) throw Error(`order has extra spaces. Got: "${order}".\n`)
  const orderSections = order.split(' ')
  if (orderSections.length > 2) {
    throw Error(`order is invalid. Got: "${order}".\n` +
      "Correct examples: 'first', 'last', 'root', 'ui', 'before ui', 'after ui'")
  }
  let [prefix, groupName] = orderSections
  if (!groupName) {
    groupName = prefix
    prefix = ''
  }
  if (!groupName) groupName = DEFAULT_ORDER_GROUP
  if (!prefix) prefix = DEFAULT_ORDER_PREFIX
  if (!ORDER_PREFIXES.includes(prefix)) {
    throw Error(`supported order prefixes are ${ORDER_PREFIXES.join(', ')}. Got: "${order}"`)
  }
  if (!ORDER_GROUPS.includes(groupName)) {
    throw Error(`supported order groups are ${ORDER_GROUPS.join(', ')}. Got: "${order}"`)
  }
  return `${prefix} ${groupName}`
}
