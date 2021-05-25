import { useConfig } from './config'

export default function useLangs (options = {}) {
  const config = useConfig()
  let { langs } = config

  if (options.exceptDefault) langs = langs.filter(lang => lang !== config.lang)

  return langs
}
