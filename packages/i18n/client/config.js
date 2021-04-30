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

function getLocalConfig (baseConfig) {
  const config = defaults(
    cloneDeep(baseConfig),
    { defaultLang: DEFAULT_LANGUAGE, supportedLangs: [] }
  )
  const getSupportedLangs = config.getSupportedLangs

  if (typeof getSupportedLangs === 'function') {
    let supportedLangs = getSupportedLangs()

    if (!Array.isArray(supportedLangs)) {
      throw new Error(
        '[@staratupjs/i18n]: getSupportedLangs ' +
        'must return an array of languages'
      )
    }

    delete config.getSupportedLangs
    config.supportedLangs = supportedLangs
  }

  const { defaultLang, supportedLangs } = config

  if (!supportedLangs.includes(defaultLang)) {
    config.supportedLangs = [defaultLang].concat(supportedLangs)
  }

  return config
}

export function useConfig () {
  return localConfig
}

export function getConfig () {
  return localConfig
}
