import pluralize from 'pluralize'

export default function hasOne (AssociatedOrmEntity, options) {
  return function (OrmEntity) {
    OrmEntity.associations.push(
      Object.assign({
        type: 'hasOne',
        orm: AssociatedOrmEntity,
        key: pluralize.singular(AssociatedOrmEntity.collection) + 'Id'
      }, options)
    )
  }
}
