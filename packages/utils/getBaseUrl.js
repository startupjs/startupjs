export default function getBaseUrl () {
  let url
  if (typeof window !== 'undefined') url = window.location?.origin
  url ??= 'http://localhost:3000'
  return url
}
