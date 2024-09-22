/**
 * @description This hook is triggering right before user creating operation
 * Here you can easily manage user data before user creation
 */
export default function parseUserCreationData (user) {
  console.log('[@dmapper/auth] New user fields / parseUserCreationData hook:', user)

  return user
}
