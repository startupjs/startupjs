# startupjs racer-schema
schema for document of racer's model

## Usage

1. in `server/index.js` add `validateSchema: true` to `startupjsServer()` options
2. Go to one of your ORM document entities (for example, `UserModel`, which targets `users.*`) and add a static method `schema`:

```js
import { BaseModel } from 'startupjs/orm'

export default class UserModel extends BaseModel {
  static schema = {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    age: {
      type: 'number',
      multipleOf: 1,
      minimum: 0,
      maximum: 130
    }
  }
}
```

## License

MIT

(c) Decision Mapper - http://decisionmapper.com
