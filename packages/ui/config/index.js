import merge from 'lodash/merge'
import getBaseConfig from './base'
import getComponentsConfig from './components'

export default function (config = {}) {
  const baseConfig = getBaseConfig(config.pallete)
  const _config = merge({}, baseConfig, config)
  const componentsConfig = getComponentsConfig(_config)
  return merge({}, componentsConfig, _config)
}
