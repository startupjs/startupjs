import { Signal } from 'startupjs'

export default class TestCountModel extends Signal {
  async create () {
    await this.set({ value: 0 })
  }

  async reset () {
    await this.value.set(0)
  }
}
