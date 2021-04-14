import cloneDeep from 'lodash/cloneDeep'
import defaults from 'lodash/defaults'

const DEFAULT_LANGUAGE = 'en'
let localConfig = {}

export function initConfig (config) {
  if (Object.keys(localConfig).length) {
    throw new Error(
      '[@dmapper/orgs] initConfig: config already initialized'
    )
  }

  Object.assign(localConfig, getLocalConfig(config))
}

export function useConfig () {
  return localConfig
}

function getLocalConfig (baseConfig) {
  const config = defaults(
    cloneDeep(baseConfig),
    { defaultLang: DEFAULT_LANGUAGE, supportedLangs: [] }
  )

  const getSupportedLangs = config.getSupportedLangs

  if (getSupportedLangs) {
    const supportedLangs = getSupportedLangs
    if (!Array.isArray(supportedLangs)) {
      throw new Error(
        '[@staratupjs/i18n]: getSupportedLangs ' +
        'must return an array of languages'
      )
    }

    config.supportedLangs = supportedLangs
      .filter(lang => lang !== config.defaultLang)

    delete config.getSupportedLangs
  }

  return config
}
