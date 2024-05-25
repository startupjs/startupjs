export async function getDbSchools (model, collectionName) {
  const $$schools = model.query(collectionName, {})
  await $$schools.fetch()
  const schools = $$schools.get()

  if (!schools.length) return null

  const data = {}
  for (const school of schools) {
    data[school.name] = {
      name: school.name,
      consumerKey: school.key,
      consumerSecret: school.secret,
      redirect: school.redirect
    }
  }
  return data
}
