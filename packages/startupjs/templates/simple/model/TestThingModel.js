import { BaseModel } from 'startupjs/orm'

export default class TestThingModel extends BaseModel {
  async addSelf () {
    await this.root.addAsync(this.getCollection(), {
      id: this.getId(),
      counter: 0
    })
  }

  async reset () {
    await this.setAsync('counter', 0)
  }
}
