import { useConfig } from './config'

export default function useLangs (options = {}) {
  if (typeof options.default === 'undefined') options.default = true

  const config = useConfig()
  let { langs } = config

  if (!options.default) langs = langs.filter(lang => lang !== config.lang)

  return langs
}
