import { createURL } from 'expo-linking'

const EXPO_DEFAULT_PORT = 8081
const DEFAULT_BASE_URL = `http://localhost:${EXPO_DEFAULT_PORT}`

export default function getBaseUrl () {
  let url
  if (typeof window !== 'undefined') url ??= window.location?.origin
  try {
    url ??= createURL('/')
  } catch (err) {}
  url ??= DEFAULT_BASE_URL
  if (/^exps?:/.test(url)) {
    url = url.replace(/^exp/, 'http')
    url = url.replace(/\/--\/$/, '')
  } else if (!/^https?:/.test(url)) {
    url = DEFAULT_BASE_URL
  }
  return url
}
