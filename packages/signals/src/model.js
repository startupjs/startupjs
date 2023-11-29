import rootModel from '@startupjs/model'

let lateRootModel
export function getRootModel () {
  // this will hopefully let the ORM initialize first and return a model overloaded with extra methods
  if (!lateRootModel) lateRootModel = rootModel.scope()
  return lateRootModel
}
