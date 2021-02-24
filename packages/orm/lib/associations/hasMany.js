import pluralize from 'pluralize'

export default function hasMany (AssociatedOrmEntity, options) {
  return function (OrmEntity) {
    OrmEntity.addAssociation(
      Object.assign({
        type: 'hasMany',
        orm: AssociatedOrmEntity,
        key: pluralize.singular(AssociatedOrmEntity.collection) + 'Ids',
        childrenName: AssociatedOrmEntity.collection
      }, options)
    )

    AssociatedOrmEntity.addAssociation(
      Object.assign({
        type: 'oppositeHasMany',
        orm: OrmEntity,
        key: pluralize.singular(AssociatedOrmEntity.collection) + 'Ids',
        childrenName: OrmEntity.collection,
        opposite: true
      }, options)
    )

    return OrmEntity
  }
}
