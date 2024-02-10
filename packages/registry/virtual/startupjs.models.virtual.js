// This is virtual module for loading ORM models into startupjs.
//
// Babel plugin '@startupjs/babel-plugin-startupjs-plugins' will transform
// ```
// import models from './startupjs.models.virtual.js'
// ```
// into a imports for each model file from the project's 'model' folder.
// Filename is used as the path templates for the model.
//
// Example:
//
//   /model
//     /users.js
//     /users.[id].js
//     /_session.games.js
//     /_session.games.[id].js
//
// Will be transformed into:
//
//   import { default as $1 } from './model/users.js'
//   import { default as $2 } from './model/users.[id].js'
//   import { default as $3 } from './model/_session.games.js'
//   import { default as $4 } from './model/_session.games.[id].js'
//   const models = { users: $1, 'users.*': $2, '_session.games': $3, '_session.games.*': $4 }
//
// NOTE: Instead of '*' which used by racer.orm() you must use '[id]' in the filename.
//
// This file is only being used directly as a mock if 'model' folder does not exist in the project.

export default {}
