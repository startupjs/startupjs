# Models hook

С помощью хука 'models' можно модифицировать модели или добавлять новые. Хук получает модели (projectModels), которые были добавлены в проект.

## Добавим новую модель

Давайте рассмотрим, как мы можем добавить модель коллекции persons.

Работая с платформой startupjs, вы, вероятно, уже знакомы с папкой model, в файлах которой как раз и лежат те самые модели. Каждая модель состоит из определенного набора данных (методов, констант и т.д.), которые из файла модели экспортируются.

Для добавления новой модели, нам необходимо создать объект с теми же полями (методы, константы и прочее), которые мы обычно экспортируем из файла модели. Естественно, вы будете указывать только те данные, которые вам нужны.

Вы сами решаете, как вам собирать и получать данные для модели. Мы рассмотрим пару простых примеров. В первом варианте, опишем все в одном файле:

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
          // существующие модели
          ...projectModels,
          // добавляем модель persons
          // для коллекции persons описываем необходимые поля
          persons: {
            // в default указывается ORM класс с реализацией кастомных методов для этой модели коллекции
            // сам класс мы описали сразу после плагина
            default: PersonsModel,
            // и далее в таком же стиле описываем остальные поля, если они нужны
            // например, добавляем schema (если речь идет о коллекции).
            // здесь мы использовали сокращенную запись schema: schema
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

Еще одним вариантом подключения модели через плагин будет импорт данных из файла, то есть вместо того, чтоб описывать все данные в одном файле с плагином, как это было сделано выше, мы вынесем все данные по модели в отдельный файл. Объект с классом модели коллекции, схемой и другими данными (если они нужны) необходимо экспортировать по дефолту.

В файле модели могут быть описаны и экспортированы:
- класс модели,
- схема данных,
- методы класса,
- статические методы,
- константы,
- индексы базы данных

Создадим файл persons.js, в котором опишем все необходимые данные и затем экспортируем их:

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

  // Вы можете импортировать все вышеописанные данные в файле плагина и там собрать объект.
  // Но можно сразу собрать его здесь, например
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

Создадим файл persons.js с классом модели коллекции Persons. По умолчанию в классе не будет ни одного метода. Мы добавим метод addNew с помощью плагина, модифицировав класс. Файл persons.js с классом модели коллекции Persons мы создали для примера. Вы можете использовать для работы любую другую уже существующую модель.

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
  // Импортируем объект, описанный выше в файле persons.js
  // Соответственно, если вы работаете с уже существующей моделью, то ничего экспортировать тут не нужно
  import persons from './persons.js'

  export default createPlugins({
    name: 'updatePersonModel',
    isomorphic: () => ({
      // Получаем модели проекта (projectModels)
      models: (projectModels) => {
        // Наследуем класс от PersonModel, который был импортирован из person.js как persons
        // Это может быть любая другая уже существующая модель, которая хранится у нас в projectModels
        // Наследование нам нужно как раз в том случае, если мы хотим модифицировать уже существующую модель
        // например, class ModifiedFilesModel extends projectModels.files.default - мы создали наследника от модели Files

        // Вернемся к нешму примеру:
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
