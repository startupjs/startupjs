export const encodePath = str => str.replace(/\./g, '%2E')
export const decodePath = str => str.replace(/%2E/g, '.')
