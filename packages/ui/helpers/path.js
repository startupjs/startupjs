import { $root, useLocal } from 'startupjs'

const SESSION_PATH = '_session.ui'

function generatePath (path, subpath = '') {
  if (subpath) {
    if (typeof subpath !== 'string') {
      throw new Error('[@startupjs/ui] generatePath: path must be a string')
    }
    path += `.${subpath}`
  }

  return path
}

export function getSessionUI (path) {
  return $root.at(generatePath(SESSION_PATH, path))
}

export function useSessionUI (path) {
  return useLocal(generatePath(SESSION_PATH, path))
}
