import { BaseModel } from 'startupjs/orm.js'

const DRAFT_POSTFIX = '--draft'

export default class BaseTranslationModel extends BaseModel {
  async createNew () {
    const collection = this.getCollection()
    const draftId = this.getDraftId()

    await Promise.all([
      this.create(),
      this.root.add(collection, { id: draftId })
    ])
  }

  getDraftId () {
    return this.getId() + DRAFT_POSTFIX
  }
}
