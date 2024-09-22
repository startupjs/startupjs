/**
 * @description This hook is triggering right after email change logic
 */
export default function onAfterEmailChange ({ userId }, req) {
  console.log('\n[@dmapper/auth] After email change hook', { userId }, '\n')
}
