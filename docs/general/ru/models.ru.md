# 'Models' hook

С помощью хука 'models' можно модифицировать модели или добавлять новые. Хук получает модели (projectModels), которые были добавлены в проект.

## Добавим новую модель

Давайте рассмотрим пример, как мы можем добавить модель для коллекции persons.

Работая с платформой startupjs, вы, вероятно, уже познакомились с папкой model, в файлах которой как раз и лежат те самые модели. Каждая модель связана с определенным набором данных (методов, констант и т.д.). Эти данные могут храниться как в самом файле с моделью, так и в любом другом месте.

Для добавления новой модели, нам необходимо создать объект с теми же полями (методы, константы и прочее), которые мы обычно используем для модели. Естественно, вы будете указывать только те данные, которые вам нужны.

Мы рассмотрим пару простых примеров. В первом варианте, опишем все данные в одном файле с плагином:

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

Еще одним вариантом подключения модели через плагин будет импорт данных из файлов, в которых описаны все необходимые данные.

Мы можем импортировать:
- класс модели,
- схему данных,
- методы класса,
- статические методы,
- константы,
- индексы базы данных

Для простоты, мы создадим отдельный файл persons.js, в котором определим модель, схему и другие данные. Однако, повторимся, что только вы решаете, как и где будет храниться информация, то есть сам файл persons.js может быть собран по кусочкам через импорт отдельно схемы, отдельно индексов и т.д.

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

Модель коллекции или модель документа коллекции можно расширить дополнительным функционалом. Для этого необходимо определить свой класс, расширив базовый и реализовав необходимые методы.

Создадим файл persons.js с классом модели коллекции Persons. Мы добавим метод addNew с помощью плагина, модифицировав класс.

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
