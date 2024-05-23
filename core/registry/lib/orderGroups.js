// order groups which you can specify in plugin.order
// Additionally, 'before <group>' and 'after <group>' can be used
export default [
  'first',
  'root',
  'session',
  'auth',
  'api',
  'pure', // for pure startupjs plugins which don't depend on 'ui' or 'router' being present
  'ui', // for plugins which depend on 'ui' being present and initialized
  'router', // for plugins which depend on 'router' being present and initialized
  'default', // this is the default group which executes after everything else
  'last'
]
