import pluralize from 'pluralize'

export default function hasMany (AssociatedOrmEntity, options = {}) {
  return function (OrmEntity) {
    const key = pluralize.singular(AssociatedOrmEntity.collection) + 'Ids'

    OrmEntity.addAssociation(
      Object.assign({
        type: 'hasMany',
        orm: AssociatedOrmEntity,
        key
      }, options)
    )

    AssociatedOrmEntity.addAssociation(
      Object.assign({
        type: 'oppositeHasMany',
        orm: OrmEntity,
        key,
        opposite: true
      }, options)
    )

    return OrmEntity
  }
}
