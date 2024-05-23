/**
 * @description This hook is triggering right after password reset logic
 */
export default async function onAfterPasswordReset ({ userId }, req) {
  console.log('\n[@dmapper/auth] AFTER password reset hook', { userId }, '\n')
}
