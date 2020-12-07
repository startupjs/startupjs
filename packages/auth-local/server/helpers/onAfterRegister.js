/**
 * @description This hook is triggering right after user register
 */
export default async function onAfterRegister ({ userId }, req) {
  console.log('\n[@dmapper/auth] AFTER user register hook', { userId }, '\n')
}
