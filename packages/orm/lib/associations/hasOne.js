import pluralize from 'pluralize'

export default function hasMany (AssociatedOrmEntity, options) {
  return function (OrmEntity) {
    OrmEntity.associations.push(
      Object.assign({
        type: 'hasMany',
        orm: AssociatedOrmEntity,
        key: pluralize.singular(AssociatedOrmEntity.collection) + 'Id'
      }, options)
    )
  }
}
