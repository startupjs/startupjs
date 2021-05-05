export default function isExtraQuery (queryParams: {
  $count?: boolean,
  $aggregate?: any,
  $queryName?: string,
  $aggregationName?: string
}): boolean {
  return queryParams.$count || queryParams.$aggregate || queryParams.$queryName || queryParams.$aggregationName
}
