import { useLocal } from 'startupjs'

export default function usePage (subpath) {
  let path = '_page'

  if (subpath && typeof subpath === 'string') {
    path += `.${subpath}`
  }

  return useLocal(path)
}
