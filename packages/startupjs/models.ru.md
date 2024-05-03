# Models Hook

С помощью хука 'models' можно модифицировать модели или добавлять новые. Хук получает модели (projectModels), которые были добавлены в проект.

## Добавим новую модель

Рассмотрим пример для модели коллекции persons. В этом примере опишем все в одном файле.

Для каждой коллекции или документа необходимо указать объект с теми же полями, которые экспортируются из файла модели. В качестве альтернативы вы можете импортировать файл с моделью (ниже мы рассмотрим, как это делается).

```js
  import { BaseModel } from 'startupjs/orm'

  const schema = {
    name: { type: 'string', required: true },
    age: { type: 'number' },
    gender: { type: 'string', enum: ['man', 'woman'] },
    phone: { type: 'string' },
    createdAt: { type: 'number' },
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
          // для коллекции persons описываем необходимые поля
          persons: {
            // в default указывается ORM класс с реализацией кастомных методов для этой модели коллекции
            default: PersonsModel,
            // и далее в таком же стиле описываем остальные поля, если они нужны
            // например, добавляем schema (если речь идет о коллекции)
            schema
          },
          // далеее точно так же описываются и другие коллекций
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
```

Еще одним вариантом подключения модели через плагин будет импорт данных из файла. В самом же импортируемом файле необходимо будет описать все поля, которые нужны в persons. Объект с классом модели коллекции, схемой и другими данными (если они нужны) необходимо экспортировать по дефолту.

В файле модели могут быть описаны и экспортированы:
- класс модели,
- схема данных,
- методы класса,
- статические методы,
- константы,
- индексы базы данных

Создадим файл persons.js, из которого будем экспортировать все необходимые данные:

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

  // schema
  export const schema = {
    name: { type: 'string', required: true },
    age: { type: 'number' },
    gender: { type: 'string', enum: ['man', 'woman'] },
    phone: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  }

  // индексы
  export const indexes = [
    { keys: { phone: 1 }, options: { unique: true } }
  ]

  // собираем объект с данными
  const persons = {
    default: PersonsModel,
    schema,
    indexes
  }

  // экспортируем готовый объект
  export default persons
```

Файл плагина в этом случае будет выглядеть так:

```js
  // импортируем объект, описанный выше в файле persons.js
  import persons from './persons.js'

  export default createPlugins({
    name: 'addPersonModel',
    isomorphic: () => ({
      // Получаем модели проекта (projectModels)
      models: (projectModels) => {
        if (projectModels.persons) throw Error('The model already exists')
        return {
          ...projectModels,
          // здесь можно записать в сокращенном виде
          // persons: persons (название коллекции : импортированный объект,
          // в котором у нас уже собраны все необходимые поля)
          persons
        }
      }
    })
  })
```

## Модифицируем модель

Создадим файл persons.js с классом модели коллекции persons. По умолчанию в классе не будет ни одного метода. Мы добавим метод addNew с помощью плагина, модифицировав класс.

```js
  import { BaseModel } from 'startupjs/orm'

  class PersonsModel extends BaseModel {
  }

  export const schema = {
    name: { type: 'string', required: true },
    age: { type: 'number' },
    gender: { type: 'string', enum: ['man', 'woman'] },
    phone: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  }

  const persons = {
    default: PersonsModel,
    schema
  }

  export default persons
```

Файл плагина в этом случае будет выглядеть так:

```js
  // импортируем объект, описанный выше в файле persons.js
  import persons from './persons.js'

  export default createPlugins({
    name: 'updatePersonModel',
    isomorphic: () => ({
      // Получаем модели проекта (projectModels)
      models: (projectModels) => {
        // Наследуем класс от PersonModel, который был импортирован из person.js
        // К слову, нам необязательно импортировать класс модели.
        // Мы можем создать наследника от класса из projectModels
        // например, class ModifiedPersonsModel extends projectModels.files.default
        class ModifiedPersonsModel extends persons.default {
          // Добавляем новый метод в наследника
          async addNew (data) {
            const now = Date.now()
            return await this.add({
              ...data,
              createdAt: now,
              updatedAt: now
            })
          }
        }
        // возвращаем новую модель
        const newModels = {
          ...projectModels,
          persons: {
            default: ModifiedPersonsModel,
            schema: persons.schema
          }
        }

        return newModels
      }
    })
  })
```
