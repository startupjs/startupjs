import { $root, useLocal } from 'startupjs'

function generatePath (subpath = '') {
  let path = '_page._ui'

  if (subpath) {
    if (typeof subpath !== 'string') {
      throw new Error('[@startupjs/ui] generatePath: path must be a string')
    }
    path += `.${subpath}`
  }

  return path
}

export function getScope (path) {
  return $root.at(generatePath(path))
}

export function usePath (path) {
  return useLocal(generatePath(path))
}
