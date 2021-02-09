import pluralize from 'pluralize'

export default function belongsTo (AssociatedOrmEntity, options) {
  return function (OrmEntity) {
    OrmEntity.addAssociation(
      Object.assign({
        type: 'belongsTo',
        orm: AssociatedOrmEntity,
        key: pluralize.singular(AssociatedOrmEntity.collection) + 'Id',
        childrenName: OrmEntity.collection
      }, options)
    )

    AssociatedOrmEntity.addAssociation(
      Object.assign({
        type: 'oppositeBelongsTo',
        orm: OrmEntity,
        key: pluralize.singular(AssociatedOrmEntity.collection) + 'Id',
        childrenName: OrmEntity.collection,
        opposite: true
      }, options)
    )

    return OrmEntity
  }
}
