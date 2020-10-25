const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {},
  tests: [
    {
      title: 'It is convert typescript interface to JSON-Schema and add that JSON to ORM model as static field',
      code: `
        import { BaseModel } from 'startupjs/orm'
    
        interface IEventModel {
          name: string;
          /**
          * @default [1.23, 65.21, -123.40, 0, 1000000.0001]
          */
          amount: number[];
        }
        
        export default class EventModel extends BaseModel {
          methodOne() {
            return 1
          }
          methodTwo() {
            return 2
          }
        }`,
      snapshot: true
    }
  ]
})
