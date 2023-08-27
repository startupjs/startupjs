import rootModel from '@startupjs/model'

let connection
export function getConnection () {
  // this will hopefully let the ORM initialize first and return a model overloaded with extra methods
  if (!connection) connection = rootModel.connection
  return connection
}
