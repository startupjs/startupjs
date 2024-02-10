import { BaseModel } from 'startupjs/orm'

export default class TestCountModel extends BaseModel {
  async addSelf () {
    await this.root.add(this.getCollection(), {
      id: this.getId(),
      value: 0
    })
  }

  async reset () {
    await this.set('value', 0)
  }
}
