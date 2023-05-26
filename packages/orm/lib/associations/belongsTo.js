import pluralize from 'pluralize'

export default function belongsTo (AssociatedOrmEntity, options = {}) {
  return function (OrmEntity) {
    const key = pluralize.singular(AssociatedOrmEntity.collection) + 'Id'

    OrmEntity.addAssociation(
      Object.assign({
        type: 'belongsTo',
        orm: AssociatedOrmEntity,
        key
      }, options)
    )

    AssociatedOrmEntity.addAssociation(
      Object.assign({
        type: 'oppositeBelongsTo',
        orm: OrmEntity,
        key,
        opposite: true
      }, options)
    )

    return OrmEntity
  }
}
