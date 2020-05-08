export default function isExtraQuery (queryParams) {
  return queryParams.$count || queryParams.$aggregate || queryParams.$queryName
}
