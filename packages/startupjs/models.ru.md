# Models Hook

Хук 'models' получает модели (projectModels), которые были добавлены в проект. С помощью этого хука можно модифицировать модели или добавлять новые. Рассмотрим работу этого хука на примерах.

Рассмотрим пример для модели коллекции persons.

```js
  import { BaseModel } from 'startupjs/orm'

  const schema = {
    name: { type: 'string', required: true },
    age: { type: 'number' },
    gender: { type: 'string', enum: ['man', 'woman'] },
    phone: { type: 'string' },
    createdAt: { type: 'number' }
    updatedAt: { type: 'number' }
  }

  export default createPlugins({
    name: 'addPersonModel',
    isomorphic: () => ({
      // Хук получает модели проекта (projectModels)
      models: (projectModels) => {
        if (projectModels.persons) throw Error('The model already exists')

        return {
          ...projectModels,
          persons: {
            // в default указывается ORM класс с реализацией кастомных методов для этой модели коллекции
            default: PersonsModel
            schema
          },
          'persons.*': {
            default: PersonModel
          }
        }
      }
    })
  })

  class PersonsModel extends BaseModel {
    async addNew (data) {
      const now = Date.now()
      return await this.add({
        ...data,
        createdAt: now,
        updatedAt: now
      })
    }
  }

  class PersonModel extends BaseModel {
    async edit (data) {
      if (!data) return null
      await this.setEach(data)
    }
  }
```

Еще одним вариантом подключения модели через плагин будет импорт данных. В самом же импортируемом файле необходимо будет описать все поля, которые нужны в persons, в том числе экспортировать схему. Объект с классом модели коллекции и схемой можно экспортировать по дефолту.

В файле модели могут так же находится и экспортироваться:
- класс модели,
- схема данных,
- методы класса,
- статические методы,
- константы,
- индексы базы данных

Файл persons.js:

```js
  import { BaseModel } from 'startupjs/orm'

  class PersonsModel extends BaseModel {
    // методы класса (пользовательские)
    async addNew (data) {
      const now = Date.now()
      return await this.add({
        ...data,
        createdAt: now,
        updatedAt: now
      })
    }
  }

  // экспортруем индексы
  export const indexes = [
    { keys: { phone: 1 }, options: { unique: true } }
  ]

  // экспортируем schema
  export const schema = {
    name: { type: 'string', required: true },
    age: { type: 'number' },
    gender: { type: 'string', enum: ['man', 'woman'] },
    phone: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  }

  // собираем объект с данными
  const persons = {
    default: PersonsModel,
    schema,
    indexes
  }

  export default persons
```

Файл плагина:

```js
  import persons, { schema } from './persons.js'

  export default createPlugins({
    name: 'addPersonModel',
    isomorphic: () => ({
      // Получаем модели проекта (projectModels)
      models: (projectModels) => {
        if (projectModels.persons) throw Error('The model already exists')
        return {
          ...projectModels,
          // здесь можно записать в сокращенном виде persons: persons
          persons
        }
      }
    })
  })
```
