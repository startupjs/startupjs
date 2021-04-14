import { initI18n, useI18nGlobalInit } from '@startupjs/i18n'

export default initI18n({
  getSupportedLangs: ['en', 'de', 'ru']
})
export { useI18nGlobalInit }
