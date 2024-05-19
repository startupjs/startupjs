export let connection
export let fetchOnly

export function setConnection (_connection) {
  connection = _connection
}

export function getConnection () {
  if (!connection) throw Error(ERRORS.notSet)
  return connection
}

export function setFetchOnly (_fetchOnly) {
  fetchOnly = _fetchOnly
}

const ERRORS = {
  notSet: `
    Connection is not set.
    You must set the initialized ShareDB connection before using subscriptions.
    You've probably forgotten to call connect() in your app:

    import connect from '@startupjs/signals-orm/connect'
    connect({ baseUrl: 'http://localhost:3000' })
  `
}
