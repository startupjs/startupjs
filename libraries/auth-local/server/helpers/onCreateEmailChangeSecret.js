/**
 * @description This hook is triggering right after email change secret creation
 */
export default function onCreateEmailChangeSecret ({ userId, secret }, req) {
  console.log('\n[@dmapper/auth] After create email change secret hook', secret)
  console.log(`\n[@dmapper/auth] Secret for user ${userId} has been created`, '\n')
}
