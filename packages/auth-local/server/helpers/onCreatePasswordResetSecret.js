/**
 * @description This hook is triggering right after passwor reset secret creation
 */
export default function onCreatePasswordResetSecret ({ userId, secret }) {
  console.log('\n[@dmapper/auth] Create password reset secret hook', '\n')
}
