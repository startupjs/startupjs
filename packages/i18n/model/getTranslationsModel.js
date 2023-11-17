import { BaseModel } from 'startupjs/orm.js'

export default function getTranslationsModel (i18nPageAccess) {
  return class BaseTranslationsModel extends BaseModel {
    async addNew (lang) {
      if (typeof lang !== 'string') {
        throw new Error(
          '[@startupjs/i18n] BaseTranslationsModel addNew: ' +
          'lang must be a string'
        )
      }

      await this.scope(lang).createNew()

      return lang
    }

    i18nPageAccess (model, next, redirect) {
      i18nPageAccess(model, next, redirect)
    }
  }
}
