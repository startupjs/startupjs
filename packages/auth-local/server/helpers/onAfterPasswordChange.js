/**
 * @description This hook is triggering right after password change logic
 */
export default function onAfterPasswordChange ({ userId }, req) {
  console.log('\n[@dmapper/auth] AFTER password change hook', { userId }, '\n')
}
