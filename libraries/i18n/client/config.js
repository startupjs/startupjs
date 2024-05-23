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
    { lang: DEFAULT_LANGUAGE, langs: [] }
  )
  const getLangs = config.getLangs

  if (typeof getLangs === 'function') {
    let langs = getLangs()

    if (!Array.isArray(langs)) {
      throw new Error(
        '[@staratupjs/i18n]: getLangs ' +
        'must return an array of languages'
      )
    }

    delete config.getLangs
    config.langs = langs
  }

  const { lang, langs } = config

  if (!langs.includes(lang)) {
    config.langs = [lang].concat(langs)
  }

  return config
}

export function useConfig () {
  return localConfig
}

export function getConfig () {
  return localConfig
}
