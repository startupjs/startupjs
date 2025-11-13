export class PublicError extends Error {
  constructor (...args) {
    super(...args)
    this.public = true
  }
}

export function getPublicError (err, fallback) {
  return err.public ? err.message : fallback
}
