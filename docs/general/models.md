# 'Models' hook

Using the 'models' hook, you can modify models or add new ones. The hook receives models (projectModels) that have been added to the project.

## Adding a new model

Let's look at an example of how we can add a model for the persons collection.

When working with the Startupjs platform, you've probably already become familiar with the model folder, where those very models are stored. Each model is associated with a specific set of data (methods, constants, etc.). This data can be stored both in the model file itself and in any other location.

To add a new model, we need to create an object with the same fields (methods, constants, etc.) that we usually use for the model. Naturally, you will specify only the data you need.

We'll look at a couple of simple examples. In the first variant, we'll describe all the data in one file with the plugin:

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
      // Hook receives project models (projectModels)
      models: (projectModels) => {
        if (projectModels.persons) throw Error('The model already exists')

        return {
          // existing models
          ...projectModels,
          // add persons model
          // for persons collection describe necessary fields
          persons: {
            // in default, specify the ORM class with custom method implementations for this collection model
            // the class itself we described right after the plugin
            default: PersonsModel,
            // and then in the same style describe other fields if needed
            // for example, add schema (if we're talking about a collection).
            // here we used shorthand notation schema: schema
            schema
          },
          // then other collections are described in exactly the same way
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

Another option for connecting a model through a plugin would be importing data from files that describe all the necessary data.

We can import:
- model class,
- data schema,
- class methods,
- static methods,
- constants,
- database indexes

For simplicity, we'll create a separate persons.js file where we'll define the model, schema, and other data. However, we repeat that only you decide how and where information will be stored, that is, the persons.js file itself can be assembled piece by piece by importing schema separately, indexes separately, etc.

```js
  import { BaseModel } from 'startupjs/orm'

  class PersonsModel extends BaseModel {
    // class methods (custom)
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

  // indexes
  export const indexes = [
    { keys: { phone: 1 }, options: { unique: true } }
  ]

  // You can import all the above data in the plugin file and assemble the object there.
  // But you can immediately assemble it here, for example
  const persons = {
    default: PersonsModel,
    schema,
    indexes
  }

  // export ready object
  export default persons
```

The plugin file in this case will look like this:

```js
  // import the object described above in the persons.js file
  import persons from './persons.js'

  export default createPlugins({
    name: 'addPersonModel',
    isomorphic: () => ({
      // Get project models (projectModels)
      models: (projectModels) => {
        if (projectModels.persons) throw Error('The model already exists')
        return {
          ...projectModels,
          // here you can write in shorthand
          // persons: persons (collection name : imported object,
          // which already has all necessary fields assembled)
          persons
        }
      }
    })
  })
```

## Modifying a model

A collection model or collection document model can be extended with additional functionality. To do this, you need to define your own class, extending the base one and implementing the necessary methods.

Let's create a persons.js file with a Persons collection model class. We'll add the addNew method using a plugin, modifying the class.

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

The plugin file in this case will look like this:

```js
  // Import the object described above in the persons.js file
  // Accordingly, if you're working with an already existing model, you don't need to export anything here
  import persons from './persons.js'

  export default createPlugins({
    name: 'updatePersonModel',
    isomorphic: () => ({
      // Get project models (projectModels)
      models: (projectModels) => {
        // Inherit class from PersonModel, which was imported from person.js as persons
        // This can be any other already existing model that is stored in our projectModels
        // We need inheritance just in case we want to modify an already existing model
        // for example, class ModifiedFilesModel extends projectModels.files.default - we created an heir from the Files model

        // Back to our example:
        class ModifiedPersonsModel extends persons.default {
          // Add new method to the heir
          async addNew (data) {
            const now = Date.now()
            return await this.add({
              ...data,
              createdAt: now,
              updatedAt: now
            })
          }
        }
        // return new model
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