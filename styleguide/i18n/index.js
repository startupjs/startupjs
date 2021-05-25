import { initI18n, useI18nGlobalInit } from '@startupjs/i18n'

export default initI18n({
  getLangs: () => ['ru', 'de', 'co', 'it', 'us', 'ag', 'uk', 'po', 'be']
})
export { useI18nGlobalInit }
