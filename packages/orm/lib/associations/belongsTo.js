import pluralize from 'pluralize'

export default function belongsTo (AssociatedOrmEntity, options) {
  return function (OrmEntity) {
    OrmEntity.associations.push(
      Object.assign({
        type: 'belongsTo',
        orm: AssociatedOrmEntity,
        key: pluralize.singular(AssociatedOrmEntity.collection) + 'Id'
      }, options)
    )
    return OrmEntity
  }
}
