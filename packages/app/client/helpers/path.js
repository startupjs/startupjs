import { $root, useLocal } from 'startupjs'

const APP_PATH = '_page.app'

function generatePath (path = '') {
  if (path && typeof path !== 'string') {
    throw new Error('[@startupjs/app] generatePath: path must be a string')
  }

  return `${APP_PATH}.${path}`
}

export function getScope (path) {
  return $root.at(generatePath(path))
}

export function usePage (path) {
  return useLocal(generatePath(path))
}
