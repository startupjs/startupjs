/**
 * @description This hook is triggering right after user register
 */
export default function onAfterRegister (userId) {
  console.log('\n[@dmapper/auth] AFTER user register hook', { userId }, '\n')
}
