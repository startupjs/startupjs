/**
 * @description This hook is triggering right after password reset logic
 */
export default function onAfterPasswordReset (userId) {
  console.log('\n[@dmapper/auth] AFTER password reset hook', { userId }, '\n')
}
