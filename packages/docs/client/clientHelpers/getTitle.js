import { DEFAULT_LANGUAGE } from '../const'

export default function getTitle (item, lang) {
  const title = item.title
    ? typeof item.title === 'string'
      ? item.title
      : item.title[lang] || item.title[DEFAULT_LANGUAGE]
    : null
  if (!title) throw Error('No title specified')
  return title
}
