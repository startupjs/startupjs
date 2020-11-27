/**
 * @description This hook is triggering right after user creation
 */
export default async function onAfterUserCreationHook (userId) {
  console.log('\n[@dmapper/auth] On after user created hook:', userId, '\n')
}
