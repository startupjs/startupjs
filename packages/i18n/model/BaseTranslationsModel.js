import { BaseModel } from 'startupjs/orm'

export default class BaseTranslationsModel extends BaseModel {
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
}
