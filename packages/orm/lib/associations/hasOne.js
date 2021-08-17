import pluralize from 'pluralize'

export default function hasOne (AssociatedOrmEntity, options = {}) {
  return function (OrmEntity) {
    const key = pluralize.singular(AssociatedOrmEntity.collection) + 'Id'

    OrmEntity.addAssociation(
      Object.assign({
        type: 'hasOne',
        orm: AssociatedOrmEntity,
        key
      }, options)
    )

    AssociatedOrmEntity.addAssociation(
      Object.assign({
        type: 'oppositeHasOne',
        orm: OrmEntity,
        key,
        opposite: true
      }, options)
    )

    return OrmEntity
  }
}
