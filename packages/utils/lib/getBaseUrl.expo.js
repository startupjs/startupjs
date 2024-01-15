import { createURL } from 'expo-linking'

const EXPO_DEFAULT_PORT = 8081

export default function getBaseUrl () {
  let url
  if (typeof window !== 'undefined') url ??= window.location?.origin
  try {
    url ??= createURL('/')
  } catch (err) {}
  url ??= `http://localhost:${EXPO_DEFAULT_PORT}`
  if (/^exps?:/.test(url)) {
    url = url.replace(/^exp/, 'http')
    url = url.replace(/\/--\/$/, '')
  }
  return url
}
