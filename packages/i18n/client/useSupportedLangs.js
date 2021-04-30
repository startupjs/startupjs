import { useConfig } from './config'

export default function useSupportedLangs (options = {}) {
  const config = useConfig()
  let { supportedLangs } = config

  if (options.exceptDefault) {
    supportedLangs = supportedLangs
      .filter(lang => lang !== config.defaultLang)
  }

  return supportedLangs
}
