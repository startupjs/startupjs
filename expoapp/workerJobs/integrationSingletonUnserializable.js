export default async function integrationSingletonUnserializable () {
  return { ok: true }
}

export const singleton = () => {
  const value = {}
  value.self = value
  return value
}
