export function isExtraQuery (queryParams) {
  return queryParams.$count || queryParams.$aggregate || queryParams.$queryName
}
