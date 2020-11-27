/**
 * @description This hook is triggering right before login operation
 * You can controll login process that implemented in base { next } callback
 */
export default function onBeforeLoginHook (data, req, res, next) {
  console.log('\n[@dmapper/auth] BEFORE login hook:', data, '\n')

  next()
}
