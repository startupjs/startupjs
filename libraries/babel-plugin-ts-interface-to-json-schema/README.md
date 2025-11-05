# @startupjs/babel-plugin-ts-interface-to-json-schema

Transforms typescript interface to JSON-schema and add schema as static field to ORM model.

## TS interface to json-schema

For compilation interface to schema I used [typescript-json-schema](https://github.com/YousefED/typescript-json-schema)
For add specific things of json-schema you should use [API](https://github.com/YousefED/typescript-json-schema/blob/master/api.md)

## Example

```ts
import { BaseModel } from 'startupjs/orm'

interface IEventModel {
  name: string
  /**
   * @default [1.23, 65.21, -123.40, 0, 1000000.0001]
   */
  amount: number[]
}

export default class EventModel extends BaseModel {
  methodOne() {
    return 1
  }
  methodTwo() {
    return 2
  }
}
```

↓ ↓ ↓ ↓ ↓ ↓

```ts
import { BaseModel } from 'startupjs/orm'

interface IEventModel {
  name: string
  /**
   * @default [1.23, 65.21, -123.40, 0, 1000000.0001]
   */

  amount: number[]
}

export default class EventModel extends BaseModel {
  static schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      amount: {
        default: [1.23, 65.21, -123.4, 0, 1000000.0001],
        type: 'array',
        items: {
          type: 'number'
        }
      }
    },
    $schema: 'http://json-schema.org/draft-07/schema#'
  }

  methodOne() {
    return 1
  }

  methodTwo() {
    return 2
  }
}
```

## License

MIT
