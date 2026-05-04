import { Signal } from 'startupjs'
import TestCount from './testCounts.schema.js'

export default class TestCountModel extends Signal<TestCount> {
  async create () {
    await this.set({ value: 0 })
  }

  async reset () {
    await this.value.set(0)
  }
}
