/**
 * @description This hook is triggering right before logout operation
 * You can controll logout process that implemented in base { next } callback
 */
export default function onBeforeLogoutHook (data, req, res, next) {
  console.log('\n[@dmapper/auth] BEFORE logout hook:', data, '\n')

  next()
}
