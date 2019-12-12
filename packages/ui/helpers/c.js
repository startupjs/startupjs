/*
 * Before executing the classnames(),
 * prefix all it's 2nd+ args (modifier names) with the 1st arg (element name):
 *
 * c('root', theme, {large, small})
 *   | | |
 *   V V V
 * classnames('root', `root-${theme}`, {
 *   'root-large': large,
 *   'root-small': small
 * })
 */
import _ from 'lodash'
import classnames from 'classnames'

const prefix = (prefix, name) => `${prefix}-${name}`
export default function c (name, ...modifiers) {
  modifiers = processModifiers(name, modifiers)
  return classnames(name, ...modifiers)
}

function processModifiers (name, modifiers) {
  return modifiers.map(modifier => {
    if (_.isArray(modifier)) return processModifiers(name, modifier)
    if (_.isString(modifier)) return prefix(name, modifier)
    return _.mapKeys(modifier, (value, key) => prefix(name, key))
  })
}

export function cPrefix (modulePrefix) {
  return function (name, ...modifiers) {
    return c(prefix(modulePrefix, name), ...modifiers)
  }
}
