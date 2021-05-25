import pluralize from 'pluralize'

export default function hasOne (AssociatedOrmEntity, options) {
  return function (OrmEntity) {
    OrmEntity.addAssociation(
      Object.assign({
        type: 'hasOne',
        orm: AssociatedOrmEntity,
        key: pluralize.singular(AssociatedOrmEntity.collection) + 'Id',
        childrenName: AssociatedOrmEntity.collection
      }, options)
    )

    AssociatedOrmEntity.addAssociation(
      Object.assign({
        type: 'oppositeHasOne',
        orm: OrmEntity,
        key: pluralize.singular(AssociatedOrmEntity.collection) + 'Id',
        childrenName: OrmEntity.collection,
        opposite: true
      }, options)
    )

    return OrmEntity
  }
}
